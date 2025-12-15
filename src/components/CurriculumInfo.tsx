import { motion } from 'motion/react';
import { GraduationCap, Brain, Globe, Lightbulb, Users, Award, BookOpen, Target, Sparkles, Heart, Trophy, Star, CheckCircle, ClipboardCheck, TrendingUp, Accessibility } from 'lucide-react';
import { Button } from './ui/button';
import { TextWithVoice } from './TextWithVoice';

interface CurriculumInfoProps {
  onBack: () => void;
}

export function CurriculumInfo({ onBack }: CurriculumInfoProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 overflow-y-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 via-white to-red-500 rounded-3xl mb-4 shadow-2xl"
          >
            <GraduationCap className="w-12 h-12 text-red-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl mb-2 bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            <TextWithVoice>Canadian Themed, Designed for Everyone</TextWithVoice>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto"
          >
            <TextWithVoice>
              Discover why the Ontario curriculum creates leaders who are ready to change the world 🍁
            </TextWithVoice>
          </motion.p>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-6"
        >
          {/* Curriculum Adored Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Award className="w-10 h-10 text-purple-600" />
              </motion.div>
              <h2 className="text-3xl text-purple-600">
                <TextWithVoice>Curriculum Adored for Creating Leaders</TextWithVoice>
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-2">
              <p className="text-lg">
                <TextWithVoice>
                  What makes the Ontario curriculum truly special is its ability to adapt to the future. 
                  It is beloved by universities and employers alike because it produces graduates who are 
                  adaptable, resilient, and ready to lead.
                </TextWithVoice>
              </p>

              <p className="text-lg">
                <TextWithVoice>
                  By balancing strong foundations in literacy and numeracy with modern competencies in 
                  technology and global citizenship, the Ontario curriculum offers a learning experience 
                  that students enjoy and parents trust.
                </TextWithVoice>
              </p>
            </div>
          </div>

          {/* Key Strengths Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Adaptability */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl text-blue-700">
                  <TextWithVoice>Adaptable & Future-Ready</TextWithVoice>
                </h3>
              </div>
              <p className="text-gray-700">
                <TextWithVoice>
                  Students learn to think critically and solve problems creatively, preparing them 
                  for careers that don't even exist yet.
                </TextWithVoice>
              </p>
            </motion.div>

            {/* Resilience */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl text-purple-700">
                  <TextWithVoice>Resilient & Determined</TextWithVoice>
                </h3>
              </div>
              <p className="text-gray-700">
                <TextWithVoice>
                  Through progressive challenges, students develop grit and perseverance, 
                  learning that mistakes are stepping stones to success.
                </TextWithVoice>
              </p>
            </motion.div>

            {/* Leadership */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4 border-2 border-pink-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl text-pink-700">
                  <TextWithVoice>Ready to Lead</TextWithVoice>
                </h3>
              </div>
              <p className="text-gray-700">
                <TextWithVoice>
                  Leadership skills are woven throughout the curriculum, empowering students 
                  to collaborate, communicate, and inspire others.
                </TextWithVoice>
              </p>
            </motion.div>

            {/* Global Citizenship */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 border-2 border-green-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl text-green-700">
                  <TextWithVoice>Global Citizens</TextWithVoice>
                </h3>
              </div>
              <p className="text-gray-700">
                <TextWithVoice>
                  Students explore diverse perspectives and cultures, developing empathy and 
                  understanding for our interconnected world.
                </TextWithVoice>
              </p>
            </motion.div>
          </div>

          {/* Core Competencies */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-purple-600" />
              <h2 className="text-3xl text-purple-600">
                <TextWithVoice>Balanced Learning Foundation</TextWithVoice>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Literacy */}
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-2">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-blue-700 mb-2">
                  <TextWithVoice>Strong Literacy</TextWithVoice>
                </h3>
                <p className="text-gray-700">
                  <TextWithVoice>
                    Reading, writing, and communication skills that open doors to every subject.
                  </TextWithVoice>
                </p>
              </motion.div>

              {/* Numeracy */}
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-2xl mb-2">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-purple-700 mb-2">
                  <TextWithVoice>Solid Numeracy</TextWithVoice>
                </h3>
                <p className="text-gray-700">
                  <TextWithVoice>
                    Mathematical thinking and problem-solving that builds logical reasoning.
                  </TextWithVoice>
                </p>
              </motion.div>

              {/* Technology */}
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border-2 border-pink-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-2xl mb-2">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-pink-700 mb-2">
                  <TextWithVoice>Modern Technology</TextWithVoice>
                </h3>
                <p className="text-gray-700">
                  <TextWithVoice>
                    Digital literacy and innovation skills for the 21st century workplace.
                  </TextWithVoice>
                </p>
              </motion.div>
            </div>
          </div>

          {/* Games Grow with Student Development */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-10 h-10 text-emerald-600" />
              <h2 className="text-3xl text-emerald-600">
                <TextWithVoice>Games Grow with Student Development</TextWithVoice>
              </h2>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
              <p className="text-lg text-gray-700 mb-4">
                <TextWithVoice>
                  Our games are designed to evolve alongside your child's learning journey. As students 
                  progress through their education, our games automatically increase in complexity to match 
                  the growing curriculum expectations at each level.
                </TextWithVoice>
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Progressive Difficulty */}
                <div className="bg-white rounded-xl p-4 border-2 border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-xl text-emerald-700">
                      <TextWithVoice>Progressive Difficulty</TextWithVoice>
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    <TextWithVoice>
                      From early literacy and basic numeracy in primary grades to advanced problem-solving 
                      and critical analysis in higher levels, each game adapts to challenge students 
                      appropriately.
                    </TextWithVoice>
                  </p>
                </div>

                {/* Curriculum-Matched Complexity */}
                <div className="bg-white rounded-xl p-4 border-2 border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-xl text-teal-700">
                      <TextWithVoice>Curriculum-Matched Complexity</TextWithVoice>
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    <TextWithVoice>
                      As curriculum expectations increase from grade to grade, our games introduce new 
                      concepts, deeper thinking requirements, and more sophisticated skill applications.
                    </TextWithVoice>
                  </p>
                </div>
              </div>

              {/* 10-Level Progression System */}
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 border-2 border-emerald-200 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl text-emerald-700">
                    <TextWithVoice>10-Level Progression System</TextWithVoice>
                  </h3>
                </div>
                <p className="text-gray-700 mb-2">
                  <TextWithVoice>
                    Students advance through 10 carefully designed levels, with each level representing 
                    a significant milestone in their academic development. To unlock the next level, 
                    students must:
                  </TextWithVoice>
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">
                      <TextWithVoice>
                        <strong>Complete 50 stages</strong> at their current level, ensuring thorough 
                        practice and mastery
                      </TextWithVoice>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">
                      <TextWithVoice>
                        <strong>Demonstrate 77% proficiency</strong> across all activities, showing 
                        solid understanding and consistent performance
                      </TextWithVoice>
                    </p>
                  </div>
                </div>
              </div>

              {/* Developmental Alignment */}
              <div className="space-y-3">
                <h3 className="text-xl text-emerald-700">
                  <TextWithVoice>How Games Adapt by Level:</TextWithVoice>
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Early Levels */}
                  <div className="bg-white rounded-lg p-4 border-2 border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌱</span>
                      <h4 className="text-emerald-700">
                        <TextWithVoice>Early Levels (1-3)</TextWithVoice>
                      </h4>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Letter recognition & phonics</TextWithVoice>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Basic counting & shapes</TextWithVoice>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Simple patterns & sorting</TextWithVoice>
                      </li>
                    </ul>
                  </div>

                  {/* Middle Levels */}
                  <div className="bg-white rounded-lg p-4 border-2 border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌿</span>
                      <h4 className="text-emerald-700">
                        <TextWithVoice>Middle Levels (4-7)</TextWithVoice>
                      </h4>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Reading comprehension</TextWithVoice>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Multi-step math problems</TextWithVoice>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Critical thinking & analysis</TextWithVoice>
                      </li>
                    </ul>
                  </div>

                  {/* Advanced Levels */}
                  <div className="bg-white rounded-lg p-4 border-2 border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌳</span>
                      <h4 className="text-emerald-700">
                        <TextWithVoice>Advanced Levels (8-10)</TextWithVoice>
                      </h4>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Advanced literacy & composition</TextWithVoice>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Complex mathematical reasoning</TextWithVoice>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <TextWithVoice>Abstract problem-solving</TextWithVoice>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Benefits Box */}
              <div className="mt-6 p-6 bg-white rounded-xl border-2 border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💪</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg text-emerald-700 mb-2">
                      <TextWithVoice>Always the Right Challenge</TextWithVoice>
                    </h4>
                    <p className="text-gray-700">
                      <TextWithVoice>
                        This progressive approach ensures students are never bored with content that's too easy, 
                        nor overwhelmed by material that's too advanced. Each game session provides the perfect 
                        level of challenge to build confidence, competence, and a genuine love of learning that 
                        lasts a lifetime.
                      </TextWithVoice>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Universal Design & Accessibility */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Accessibility className="w-10 h-10 text-amber-600" />
              <h2 className="text-3xl text-amber-600">
                <TextWithVoice>Designed for Every Learner</TextWithVoice>
              </h2>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
              <p className="text-lg text-gray-700 mb-4">
                <TextWithVoice>
                  All games have universal accommodations at the forefront, making them accessible for 
                  students with identifications, individual learning plans, and diverse learning needs. 
                  Proven universal design principles are at the heart of every game we create.
                </TextWithVoice>
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Universal Design for Learning */}
                <div className="bg-white rounded-xl p-4 border-2 border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="text-xl text-amber-700">
                      <TextWithVoice>Universal Design for Learning</TextWithVoice>
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    <TextWithVoice>
                      Every game is built using UDL principles, providing multiple means of representation, 
                      engagement, and expression so all students can access and demonstrate their learning.
                    </TextWithVoice>
                  </p>
                </div>

                {/* Built-In Accommodations */}
                <div className="bg-white rounded-xl p-4 border-2 border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🛠️</span>
                    </div>
                    <h3 className="text-xl text-orange-700">
                      <TextWithVoice>Built-In Accommodations</TextWithVoice>
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    <TextWithVoice>
                      Accommodations aren't add-ons — they're integrated into the core design. Students 
                      don't need to ask for help; the support is already there, seamlessly woven in.
                    </TextWithVoice>
                  </p>
                </div>
              </div>

              {/* Accessibility Features */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border-2 border-amber-200 mb-4">
                <h3 className="text-xl text-amber-700 mb-3">
                  <TextWithVoice>Accessibility Features Include:</TextWithVoice>
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <TextWithVoice>
                          <strong>Text-to-speech functionality</strong> for all written content, supporting 
                          students with reading difficulties or visual impairments
                        </TextWithVoice>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <TextWithVoice>
                          <strong>Adjustable difficulty levels</strong> that automatically adapt to each 
                          student's pace and understanding
                        </TextWithVoice>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <TextWithVoice>
                          <strong>Visual and audio cues</strong> to support diverse learning preferences 
                          and sensory needs
                        </TextWithVoice>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <TextWithVoice>
                          <strong>Clear, consistent navigation</strong> that reduces cognitive load 
                          and helps students focus on learning
                        </TextWithVoice>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <TextWithVoice>
                          <strong>Multiple response formats</strong> allowing students to show what they 
                          know in ways that work best for them
                        </TextWithVoice>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <TextWithVoice>
                          <strong>Customizable interface settings</strong> for font size, color contrast, 
                          and display preferences
                        </TextWithVoice>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support for IEPs and Individual Learning Plans */}
              <div className="space-y-3 mb-4">
                <h3 className="text-xl text-amber-700">
                  <TextWithVoice>Supporting Students with IEPs & Individual Learning Plans:</TextWithVoice>
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Students with Identifications */}
                  <div className="bg-white rounded-lg p-4 border-2 border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📋</span>
                      <h4 className="text-amber-700">
                        <TextWithVoice>IEP Support</TextWithVoice>
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      <TextWithVoice>
                        Games align with common IEP accommodations including extended time, simplified 
                        instructions, and scaffolded learning approaches.
                      </TextWithVoice>
                    </p>
                  </div>

                  {/* Differentiated Instruction */}
                  <div className="bg-white rounded-lg p-4 border-2 border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎯</span>
                      <h4 className="text-amber-700">
                        <TextWithVoice>Differentiated Learning</TextWithVoice>
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      <TextWithVoice>
                        Content automatically differentiates based on student performance, providing 
                        appropriate challenge without stigma or separation.
                      </TextWithVoice>
                    </p>
                  </div>

                  {/* Inclusive Design */}
                  <div className="bg-white rounded-lg p-4 border-2 border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🤝</span>
                      <h4 className="text-amber-700">
                        <TextWithVoice>Truly Inclusive</TextWithVoice>
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      <TextWithVoice>
                        Every student plays the same games with dignity and independence, with supports 
                        invisible to peers but readily available when needed.
                      </TextWithVoice>
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Box */}
              <div className="p-6 bg-white rounded-xl border-2 border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">♿</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg text-amber-700 mb-2">
                      <TextWithVoice>Accessibility Is Not Optional — It's Essential</TextWithVoice>
                    </h4>
                    <p className="text-gray-700">
                      <TextWithVoice>
                        We believe every student deserves to learn, play, and succeed. By designing with 
                        universal accommodations from day one, we create an inclusive learning environment 
                        where all students — regardless of their learning profile, identification, or support 
                        needs — can thrive with confidence and independence. This isn't just good design; 
                        it's equity in action.
                      </TextWithVoice>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Universities & Employers Love It */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-10 h-10 text-yellow-600" />
              <h2 className="text-3xl text-yellow-700">
                <TextWithVoice>Beloved by Universities & Employers</TextWithVoice>
              </h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-lg">
                  <TextWithVoice>
                    <strong>Universities praise</strong> Ontario graduates for their strong analytical skills, 
                    independent thinking, and readiness for advanced study.
                  </TextWithVoice>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-lg">
                  <TextWithVoice>
                    <strong>Employers value</strong> the well-rounded skill set that combines technical knowledge 
                    with soft skills like teamwork, creativity, and communication.
                  </TextWithVoice>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-lg">
                  <TextWithVoice>
                    <strong>International recognition</strong> means Ontario credentials are respected 
                    worldwide, opening global opportunities.
                  </TextWithVoice>
                </p>
              </div>
            </div>
          </div>

          {/* Students Enjoy, Parents Trust */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 text-green-600" />
              <h2 className="text-3xl text-green-700">
                <TextWithVoice>Students Enjoy, Parents Trust</TextWithVoice>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <h3 className="text-xl text-green-600 mb-2">
                  <TextWithVoice>For Students:</TextWithVoice>
                </h3>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">🎮</span>
                    <TextWithVoice>Engaging, game-based learning that makes education fun</TextWithVoice>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">🏆</span>
                    <TextWithVoice>Clear progression that celebrates achievements</TextWithVoice>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">🌟</span>
                    <TextWithVoice>Choice and agency in their learning journey</TextWithVoice>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">🤝</span>
                    <TextWithVoice>Collaborative projects with friends</TextWithVoice>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-blue-600 mb-2">
                  <TextWithVoice>For Parents:</TextWithVoice>
                </h3>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">📊</span>
                    <TextWithVoice>Transparent progress tracking and reporting</TextWithVoice>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">🎯</span>
                    <TextWithVoice>Aligned with proven educational standards</TextWithVoice>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">🛡️</span>
                    <TextWithVoice>Safe, age-appropriate content</TextWithVoice>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">💡</span>
                    <TextWithVoice>Supports homework and reinforces classroom learning</TextWithVoice>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-3xl mb-4 text-purple-600">
            <TextWithVoice>Ready to Experience the Difference?</TextWithVoice>
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            <TextWithVoice>
              Join thousands of students who are building the skills they need to succeed in school, 
              university, and beyond — all while having fun! 🍁
            </TextWithVoice>
          </p>
          <Button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg"
          >
            Start Learning Today →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}