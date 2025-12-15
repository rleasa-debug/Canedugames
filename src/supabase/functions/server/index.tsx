import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { textToSpeech, getVoices } from "./elevenlabs.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-67fdf3bb/health", (c) => {
  return c.json({ status: "ok" });
});

// Save user scores
app.post("/make-server-67fdf3bb/scores/save", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    const body = await c.req.json();
    const { literacyCorrect, literacyTotal, numeracyCorrect, numeracyTotal, timeSpent } = body;

    // Get today's date as key suffix
    const today = new Date().toISOString().split('T')[0];
    const scoreKey = `user_scores_${user.id}_${today}`;
    
    // Save scores for today
    await kv.set(scoreKey, {
      userId: user.id,
      date: today,
      literacyCorrect,
      literacyTotal,
      numeracyCorrect,
      numeracyTotal,
      timeSpent,
      updatedAt: new Date().toISOString(),
    });

    // Also save user profile info
    const profileKey = `user_profile_${user.id}`;
    await kv.set(profileKey, {
      userId: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0],
      lastActive: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving scores:', error);
    return c.json({ error: 'Failed to save scores', details: String(error) }, 500);
  }
});

// Sync user scores (alias for save, used by ScoreContext auto-sync)
app.post("/make-server-67fdf3bb/scores/sync", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    const body = await c.req.json();
    const { totalScore, literacyCorrect, literacyTotal, numeracyCorrect, numeracyTotal, timeSpent, activityLog } = body;

    console.log(`📊 Syncing scores for user ${user.id}:`, {
      literacyCorrect,
      literacyTotal,
      numeracyCorrect,
      numeracyTotal,
      totalScore,
    });

    // Get today's date as key suffix
    const today = new Date().toISOString().split('T')[0];
    const scoreKey = `user_scores_${user.id}_${today}`;
    
    // Save scores for today
    await kv.set(scoreKey, {
      userId: user.id,
      date: today,
      totalScore,
      literacyCorrect,
      literacyTotal,
      numeracyCorrect,
      numeracyTotal,
      timeSpent,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ Saved scores to key: ${scoreKey}`);

    // Also save user profile info
    const profileKey = `user_profile_${user.id}`;
    const existingProfile = await kv.get(profileKey);
    await kv.set(profileKey, {
      ...existingProfile,
      userId: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0],
      lastActive: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error syncing scores:', error);
    return c.json({ error: 'Failed to sync scores', details: String(error) }, 500);
  }
});

// Get user scores (today and history)
app.get("/make-server-67fdf3bb/scores", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    // Get all scores for this user
    const prefix = `user_scores_${user.id}_`;
    const scores = await kv.getByPrefix(prefix);

    return c.json({ 
      scores: scores.sort((a, b) => b.date.localeCompare(a.date)) // Most recent first
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return c.json({ error: 'Failed to fetch scores', details: String(error) }, 500);
  }
});

// Get today's scores
app.get("/make-server-67fdf3bb/scores/today", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    const today = new Date().toISOString().split('T')[0];
    const scoreKey = `user_scores_${user.id}_${today}`;
    const todayScore = await kv.get(scoreKey);

    return c.json({ 
      score: todayScore || {
        literacyCorrect: 0,
        literacyTotal: 0,
        numeracyCorrect: 0,
        numeracyTotal: 0,
        timeSpent: 0,
      }
    });
  } catch (error) {
    console.error('Error fetching today\'s scores:', error);
    return c.json({ error: 'Failed to fetch today\'s scores', details: String(error) }, 500);
  }
});

// Save activity log
app.post("/make-server-67fdf3bb/activity/log", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    const body = await c.req.json();
    const { activityId, gameName, gameId, correct, total, type, duration } = body;

    // Save activity
    const activityKey = `activity_${user.id}_${activityId}`;
    await kv.set(activityKey, {
      userId: user.id,
      activityId,
      gameName,
      gameId,
      date: new Date().toISOString(),
      accuracy: total > 0 ? (correct / total) * 100 : 0,
      correct,
      total,
      type,
      duration,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error logging activity:', error);
    return c.json({ error: 'Failed to log activity', details: String(error) }, 500);
  }
});

// Get activity log
app.get("/make-server-67fdf3bb/activity/log", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    const prefix = `activity_${user.id}_`;
    const activities = await kv.getByPrefix(prefix);

    return c.json({ activities: activities || [] });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    return c.json({ error: 'Failed to fetch activity log', details: String(error) }, 500);
  }
});

// Get leaderboard
app.get("/make-server-67fdf3bb/leaderboard", async (c) => {
  try {
    // Get all user profiles
    const profiles = await kv.getByPrefix('user_profile_');
    
    const leaderboardData = await Promise.all(
      profiles.map(async (profile: any) => {
        const userId = profile.userId;
        
        // Get all scores for this user
        const scores = await kv.getByPrefix(`user_scores_${userId}_`);
        
        // Get all activities for this user
        const activities = await kv.getByPrefix(`activity_${userId}_`);
        
        // Calculate metrics
        
        // 1. Total usage (total time spent across all days)
        const totalTimeSpent = scores.reduce((sum: number, score: any) => sum + (score.timeSpent || 0), 0);
        
        // 2. Overall accuracy
        const totalCorrect = scores.reduce((sum: number, score: any) => 
          sum + (score.literacyCorrect || 0) + (score.numeracyCorrect || 0), 0);
        const totalQuestions = scores.reduce((sum: number, score: any) => 
          sum + (score.literacyTotal || 0) + (score.numeracyTotal || 0), 0);
        const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
        
        // 3. Different games played
        const uniqueGames = new Set(activities.map((a: any) => a.gameId));
        const gamesPlayed = uniqueGames.size;
        
        // 4. Consecutive days
        const dates = scores.map((s: any) => s.date).sort();
        let consecutiveDays = 0;
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        
        for (let i = dates.length - 1; i >= 0; i--) {
          const date = dates[i];
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() - currentStreak);
          const expectedDateStr = expectedDate.toISOString().split('T')[0];
          
          if (date === expectedDateStr) {
            currentStreak++;
          } else {
            break;
          }
        }
        consecutiveDays = currentStreak;
        
        // Normalize metrics (0-100 scale)
        // Usage: normalize to max 2 hours (7200 seconds) = 100%
        const usageScore = Math.min((totalTimeSpent / 7200) * 100, 100);
        
        // Accuracy: already 0-100
        const accuracyScore = accuracy;
        
        // Games played: normalize to 13 games (all games) = 100%
        const gamesScore = Math.min((gamesPlayed / 13) * 100, 100);
        
        // Consecutive days: normalize to 30 days = 100%
        const streakScore = Math.min((consecutiveDays / 30) * 100, 100);
        
        // Calculate composite score (equal weights: 25% each)
        const compositeScore = (usageScore * 0.25) + (accuracyScore * 0.25) + (gamesScore * 0.25) + (streakScore * 0.25);
        
        return {
          userId,
          name: profile.name || profile.email?.split('@')[0] || 'Student',
          email: profile.email,
          compositeScore: Math.round(compositeScore * 10) / 10, // Round to 1 decimal
          metrics: {
            usage: Math.round(usageScore * 10) / 10,
            accuracy: Math.round(accuracyScore * 10) / 10,
            gamesPlayed: gamesPlayed,
            gamesScore: Math.round(gamesScore * 10) / 10,
            consecutiveDays: consecutiveDays,
            streakScore: Math.round(streakScore * 10) / 10,
          },
          lastActive: profile.lastActive,
        };
      })
    );
    
    // Sort by composite score and return top 5
    const topFive = leaderboardData
      .filter(data => data.compositeScore > 0) // Only include users with activity
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 5);
    
    return c.json({ leaderboard: topFive });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ error: 'Failed to fetch leaderboard', details: String(error) }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-67fdf3bb/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split('@')[0] },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message || 'Failed to create account' }, 400);
    }

    // Create user profile
    const profileKey = `user_profile_${data.user.id}`;
    await kv.set(profileKey, {
      userId: data.user.id,
      email: data.user.email,
      name: name || email.split('@')[0],
      isPremium: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ error: 'Failed to create account', details: String(error) }, 500);
  }
});

// Check subscription status
app.get("/make-server-67fdf3bb/subscription/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    const profileKey = `user_profile_${user.id}`;
    const profile = await kv.get(profileKey);

    return c.json({ 
      isPremium: profile?.isPremium || false,
      subscriptionId: profile?.subscriptionId || null,
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return c.json({ error: 'Failed to check subscription status', details: String(error) }, 500);
  }
});

// Create Stripe checkout session
app.post("/make-server-67fdf3bb/subscription/create-checkout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      return c.json({ error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' }, 500);
    }

    // Get plan type from request body (monthly or yearly)
    const body = await c.req.json().catch(() => ({}));
    const plan = body.plan || 'yearly'; // default to yearly now

    const isYearly = plan === 'yearly';
    const amount = isYearly ? '1499' : '799'; // $14.99 CAD yearly, $7.99 CAD monthly (legacy)
    const interval = isYearly ? 'year' : 'month';

    // Create Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'success_url': `${c.req.header('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${c.req.header('origin')}/`,
        'customer_email': user.email || '',
        'line_items[0][price_data][currency]': 'cad',
        'line_items[0][price_data][product_data][name]': `CAN|EDU Games Premium (${isYearly ? 'Yearly' : 'Monthly'})`,
        'line_items[0][price_data][product_data][description]': 'Full progress tracking and analytics for up to 5 children',
        'line_items[0][price_data][recurring][interval]': interval,
        'line_items[0][price_data][unit_amount]': amount,
        'line_items[0][quantity]': '1',
        'metadata[user_id]': user.id,
        'metadata[plan]': plan,
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error('Stripe error:', session);
      return c.json({ error: 'Failed to create checkout session', details: session }, 500);
    }

    return c.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return c.json({ error: 'Failed to create checkout session', details: String(error) }, 500);
  }
});

// Stripe webhook to handle subscription events
app.post("/make-server-67fdf3bb/subscription/webhook", async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header('stripe-signature');
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    // Verify webhook signature if secret is configured
    if (STRIPE_WEBHOOK_SECRET && signature) {
      // In production, you should verify the signature using Stripe's library
      // For now, we'll parse the event directly
      console.log('Webhook signature received (verification recommended for production)');
    }

    const event = JSON.parse(body);
    console.log(`Stripe webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;

        if (userId) {
          // Update user profile to premium
          const profileKey = `user_profile_${userId}`;
          const profile = await kv.get(profileKey);
          
          await kv.set(profileKey, {
            ...profile,
            isPremium: true,
            subscriptionId: session.subscription,
            customerId: session.customer,
            plan: session.metadata?.plan || 'yearly',
            subscriptionStartDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          console.log(`✅ User ${userId} upgraded to premium`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const profileKey = `user_profile_${userId}`;
          const profile = await kv.get(profileKey);

          // Check if subscription is still active
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          
          await kv.set(profileKey, {
            ...profile,
            isPremium: isActive,
            subscriptionStatus: subscription.status,
            updatedAt: new Date().toISOString(),
          });

          console.log(`✅ User ${userId} subscription updated: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          // Downgrade user to free
          const profileKey = `user_profile_${userId}`;
          const profile = await kv.get(profileKey);
          
          await kv.set(profileKey, {
            ...profile,
            isPremium: false,
            subscriptionStatus: 'canceled',
            subscriptionEndDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          console.log(`✅ User ${userId} subscription canceled`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log(`⚠️ Payment failed for customer: ${invoice.customer}`);
        // You could send an email notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook failed', details: String(error) }, 500);
  }
});

// ADMIN ENDPOINT - Get all students and their stats
app.get("/make-server-67fdf3bb/admin/students", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    // ADMIN CHECK - Only allow users with 'admin' or 'teacher' in their email
    const isAdmin = user.email?.toLowerCase().includes('admin') || 
                    user.email?.toLowerCase().includes('teacher') ||
                    user.email?.toLowerCase() === 'r.leasa@tvdsb.ca' ||
                    user.user_metadata?.isAdmin === true;
    
    if (!isAdmin) {
      console.log(`Non-admin user ${user.email} attempted to access admin dashboard`);
      return c.json({ error: 'Forbidden - Admin access only' }, 403);
    }

    console.log(`Admin user ${user.email} accessing student data`);

    // Get all user profiles
    const profiles = await kv.getByPrefix('user_profile_');
    
    const studentsData = await Promise.all(
      profiles.map(async (profile: any) => {
        const userId = profile.userId;
        
        // Get all scores for this user
        const scores = await kv.getByPrefix(`user_scores_${userId}_`);
        
        // Get all activities for this user
        const activities = await kv.getByPrefix(`activity_${userId}_`);
        
        // Calculate totals
        let literacyCorrect = 0;
        let literacyTotal = 0;
        let numeracyCorrect = 0;
        let numeracyTotal = 0;
        let totalTimeSpent = 0;
        
        scores.forEach((score: any) => {
          literacyCorrect += score.literacyCorrect || 0;
          literacyTotal += score.literacyTotal || 0;
          numeracyCorrect += score.numeracyCorrect || 0;
          numeracyTotal += score.numeracyTotal || 0;
          totalTimeSpent += score.timeSpent || 0;
        });
        
        const totalCorrect = literacyCorrect + numeracyCorrect;
        const totalQuestions = literacyTotal + numeracyTotal;
        const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
        
        return {
          userId,
          name: profile.name || profile.email?.split('@')[0] || 'Student',
          email: profile.email,
          lastActive: profile.lastActive || profile.createdAt,
          totalActivities: activities.length,
          literacyCorrect,
          literacyTotal,
          numeracyCorrect,
          numeracyTotal,
          totalTimeSpent,
          overallAccuracy,
        };
      })
    );
    
    // Sort by last active (most recent first)
    studentsData.sort((a, b) => {
      const dateA = new Date(a.lastActive).getTime();
      const dateB = new Date(b.lastActive).getTime();
      return dateB - dateA;
    });
    
    return c.json({ students: studentsData });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return c.json({ error: 'Failed to fetch student data', details: String(error) }, 500);
  }
});

// Get progression data for a user's game
app.get("/make-server-67fdf3bb/progression/:userId/:gameId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const gameId = c.req.param('gameId');
    
    const progressionKey = `progression_${userId}_${gameId}`;
    const progress = await kv.get(progressionKey);

    // Return default if no progress found
    if (!progress) {
      return c.json({
        level: 1,
        stagesCompleted: 0,
        correct: 0,
        total: 0,
        unlockedLevels: [1]
      });
    }

    return c.json(progress);
  } catch (error) {
    console.error('Error fetching progression:', error);
    return c.json({ error: 'Failed to fetch progression', details: String(error) }, 500);
  }
});

// Save progression data for a user's game
app.post("/make-server-67fdf3bb/progression/:userId/:gameId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const gameId = c.req.param('gameId');
    const body = await c.req.json();
    
    const progressionKey = `progression_${userId}_${gameId}`;
    await kv.set(progressionKey, body);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving progression:', error);
    return c.json({ error: 'Failed to save progression', details: String(error) }, 500);
  }
});

// ElevenLabs text-to-speech endpoint
app.post('/elevenlabs/text-to-speech', async (c) => {
  try {
    const { text } = await c.req.json();
    
    if (!text) {
      return c.json({ error: 'Text is required' }, 400);
    }

    const audioData = await textToSpeech(text);
    
    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    // Only log non-401 errors to avoid spam from disabled API keys
    if (error instanceof Error && !error.message.includes('401')) {
      console.error('Error generating speech:', error);
    }
    return c.json({ 
      error: 'Failed to generate speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get available ElevenLabs voices
app.get("/make-server-67fdf3bb/elevenlabs/voices", async (c) => {
  try {
    const voices = await getVoices();
    return c.json(voices);
  } catch (error) {
    console.error('Error getting voices:', error);
    return c.json({ error: 'Failed to get voices', details: String(error) }, 500);
  }
});

// Weekly Leaderboard - Top 10 students, resets every Monday
app.get("/make-server-67fdf3bb/leaderboard/weekly", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - Please sign in' }, 401);
    }

    // Calculate the Monday of this week (week starts Monday at 00:00:00 UTC)
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
    const mondayDate = new Date(now);
    mondayDate.setUTCDate(now.getUTCDate() - daysToMonday);
    mondayDate.setUTCHours(0, 0, 0, 0);
    const weekStart = mondayDate.toISOString().split('T')[0];

    // Get all score keys
    const allScoreKeys = await kv.getByPrefix('user_scores_');
    
    // Group scores by user for this week - use LATEST score only (since scores are cumulative)
    const userWeeklyScores = new Map<string, {
      literacyCorrect: number;
      literacyTotal: number;
      numeracyCorrect: number;
      numeracyTotal: number;
      latestDate: string;
    }>();

    for (const scoreKey of allScoreKeys) {
      const score = await kv.get(scoreKey);
      if (!score || !score.userId || !score.date) continue;
      
      const scoreDate = score.date;
      
      // Only include scores from this week
      if (scoreDate >= weekStart) {
        const existing = userWeeklyScores.get(score.userId);
        
        // Keep only the LATEST score for each user (scores are cumulative, not incremental)
        if (!existing || scoreDate > existing.latestDate) {
          userWeeklyScores.set(score.userId, {
            literacyCorrect: score.literacyCorrect || 0,
            literacyTotal: score.literacyTotal || 0,
            numeracyCorrect: score.numeracyCorrect || 0,
            numeracyTotal: score.numeracyTotal || 0,
            latestDate: scoreDate,
          });
        }
      }
    }

    // Build leaderboard entries
    const leaderboardEntries = [];
    for (const [userId, scores] of userWeeklyScores.entries()) {
      // Get user profile
      const profile = await kv.get(`user_profile_${userId}`);
      if (!profile) continue;

      // Calculate weekly score (total correct answers from latest cumulative score)
      const weeklyScore = scores.literacyCorrect + scores.numeracyCorrect;

      leaderboardEntries.push({
        userId,
        name: profile.name || profile.email?.split('@')[0] || 'Student',
        email: profile.email,
        literacyCorrect: scores.literacyCorrect,
        literacyTotal: scores.literacyTotal,
        numeracyCorrect: scores.numeracyCorrect,
        numeracyTotal: scores.numeracyTotal,
        weeklyScore,
      });
    }

    // Sort by weekly score and take top 10
    const top10 = leaderboardEntries
      .filter(entry => entry.weeklyScore > 0)
      .sort((a, b) => b.weeklyScore - a.weeklyScore)
      .slice(0, 10)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return c.json({ 
      leaderboard: top10,
      weekStart: weekStart,
    });
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    return c.json({ error: 'Failed to fetch weekly leaderboard', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);