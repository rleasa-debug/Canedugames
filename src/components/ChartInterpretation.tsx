import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { ArrowLeft, BarChart3, TrendingUp, PieChart, Trophy, Star, ChevronRight, Target } from "lucide-react";
import { useScore } from "../contexts/ScoreContext";
import { TextWithVoice } from "./TextWithVoice";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartInterpretationProps {
  onBack: () => void;
}

interface Question {
  id: number;
  level: number;
  chartType: 'bar' | 'line' | 'pie';
  question: string;
  data: any[];
  options: string[];
  correctAnswer: number;
  xKey?: string;
  yKey?: string;
  dataKey?: string;
  nameKey?: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

// Shuffle array helper function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function ChartInterpretation({ onBack }: ChartInterpretationProps) {
  const { recordAnswer } = useScore();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const questions: Question[] = [
    // LEVEL 1 - Basic Bar Charts
    {
      id: 1,
      level: 1,
      chartType: 'bar',
      question: 'Which sport is the most popular?',
      data: [
        { sport: 'Hockey', students: 25 },
        { sport: 'Soccer', students: 18 },
        { sport: 'Basketball', students: 15 },
        { sport: 'Baseball', students: 12 }
      ],
      xKey: 'sport',
      yKey: 'students',
      options: ['Hockey', 'Soccer', 'Basketball', 'Baseball'],
      correctAnswer: 0
    },
    {
      id: 2,
      level: 1,
      chartType: 'bar',
      question: 'How many students like apples?',
      data: [
        { fruit: 'Apples', count: 20 },
        { fruit: 'Bananas', count: 15 },
        { fruit: 'Oranges', count: 12 },
        { fruit: 'Grapes', count: 18 }
      ],
      xKey: 'fruit',
      yKey: 'count',
      options: ['15', '18', '20', '12'],
      correctAnswer: 2
    },
    {
      id: 3,
      level: 1,
      chartType: 'bar',
      question: 'Which province has the fewest people?',
      data: [
        { province: 'ON', population: 45 },
        { province: 'BC', population: 30 },
        { province: 'AB', population: 25 },
        { province: 'QC', population: 40 }
      ],
      xKey: 'province',
      yKey: 'population',
      options: ['Ontario', 'British Columbia', 'Alberta', 'Quebec'],
      correctAnswer: 2
    },
    {
      id: 4,
      level: 1,
      chartType: 'bar',
      question: 'What is the total number of pets?',
      data: [
        { pet: 'Dogs', count: 8 },
        { pet: 'Cats', count: 12 },
        { pet: 'Birds', count: 5 },
        { pet: 'Fish', count: 10 }
      ],
      xKey: 'pet',
      yKey: 'count',
      options: ['30', '35', '40', '25'],
      correctAnswer: 1
    },
    {
      id: 5,
      level: 1,
      chartType: 'bar',
      question: 'Which subject has 15 students?',
      data: [
        { subject: 'Math', students: 20 },
        { subject: 'Science', students: 15 },
        { subject: 'Art', students: 12 },
        { subject: 'Music', students: 18 }
      ],
      xKey: 'subject',
      yKey: 'students',
      options: ['Math', 'Science', 'Art', 'Music'],
      correctAnswer: 1
    },
    {
      id: 51,
      level: 1,
      chartType: 'bar',
      question: 'Which Canadian animal was seen most often?',
      data: [
        { animal: 'Moose', sightings: 8 },
        { animal: 'Beaver', sightings: 14 },
        { animal: 'Bear', sightings: 6 },
        { animal: 'Deer', sightings: 11 }
      ],
      xKey: 'animal',
      yKey: 'sightings',
      options: ['Moose', 'Beaver', 'Bear', 'Deer'],
      correctAnswer: 1
    },
    {
      id: 52,
      level: 1,
      chartType: 'bar',
      question: 'How many maple trees are in the park?',
      data: [
        { tree: 'Maple', count: 22 },
        { tree: 'Oak', count: 16 },
        { tree: 'Pine', count: 19 },
        { tree: 'Birch', count: 13 }
      ],
      xKey: 'tree',
      yKey: 'count',
      options: ['16', '19', '22', '13'],
      correctAnswer: 2
    },
    {
      id: 53,
      level: 1,
      chartType: 'bar',
      question: 'Which winter activity is least popular?',
      data: [
        { activity: 'Skiing', students: 18 },
        { activity: 'Skating', students: 25 },
        { activity: 'Sledding', students: 10 },
        { activity: 'Snowboarding', students: 16 }
      ],
      xKey: 'activity',
      yKey: 'students',
      options: ['Skiing', 'Skating', 'Sledding', 'Snowboarding'],
      correctAnswer: 2
    },
    {
      id: 54,
      level: 1,
      chartType: 'bar',
      question: 'How many students prefer poutine?',
      data: [
        { food: 'Poutine', votes: 17 },
        { food: 'Pizza', votes: 22 },
        { food: 'Burgers', votes: 19 },
        { food: 'Tacos', votes: 14 }
      ],
      xKey: 'food',
      yKey: 'votes',
      options: ['14', '17', '19', '22'],
      correctAnswer: 1
    },
    {
      id: 55,
      level: 1,
      chartType: 'bar',
      question: 'Which Canadian city has the most visitors?',
      data: [
        { city: 'Toronto', visitors: 35 },
        { city: 'Montreal', visitors: 28 },
        { city: 'Vancouver', visitors: 31 },
        { city: 'Ottawa', visitors: 22 }
      ],
      xKey: 'city',
      yKey: 'visitors',
      options: ['Toronto', 'Montreal', 'Vancouver', 'Ottawa'],
      correctAnswer: 0
    },
    {
      id: 56,
      level: 1,
      chartType: 'pie',
      question: 'Which season do most students prefer?',
      data: [
        { name: 'Winter', value: 18 },
        { name: 'Spring', value: 22 },
        { name: 'Summer', value: 35 },
        { name: 'Fall', value: 25 }
      ],
      options: ['Winter', 'Spring', 'Summer', 'Fall'],
      correctAnswer: 2
    },
    {
      id: 57,
      level: 1,
      chartType: 'pie',
      question: 'Which Tim Hortons item is most popular?',
      data: [
        { name: 'Coffee', value: 40 },
        { name: 'Donuts', value: 30 },
        { name: 'Timbits', value: 20 },
        { name: 'Muffins', value: 10 }
      ],
      options: ['Coffee', 'Donuts', 'Timbits', 'Muffins'],
      correctAnswer: 0
    },
    {
      id: 58,
      level: 1,
      chartType: 'line',
      question: 'On which day did the temperature drop?',
      data: [
        { day: 'Mon', temp: 12 },
        { day: 'Tue', temp: 15 },
        { day: 'Wed', temp: 10 },
        { day: 'Thu', temp: 13 }
      ],
      xKey: 'day',
      yKey: 'temp',
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      correctAnswer: 2
    },
    {
      id: 59,
      level: 1,
      chartType: 'line',
      question: 'How many books were borrowed on Friday?',
      data: [
        { day: 'Mon', books: 8 },
        { day: 'Tue', books: 12 },
        { day: 'Wed', books: 10 },
        { day: 'Thu', books: 15 },
        { day: 'Fri', books: 18 }
      ],
      xKey: 'day',
      yKey: 'books',
      options: ['12', '15', '18', '20'],
      correctAnswer: 2
    },
    {
      id: 60,
      level: 1,
      chartType: 'bar',
      question: 'What is the total of all Canadian flags counted?',
      data: [
        { location: 'School', flags: 5 },
        { location: 'Park', flags: 8 },
        { location: 'Library', flags: 3 },
        { location: 'Mall', flags: 4 }
      ],
      xKey: 'location',
      yKey: 'flags',
      options: ['18', '20', '22', '24'],
      correctAnswer: 1
    },
    
    // LEVEL 2 - Line Graphs
    {
      id: 6,
      level: 2,
      chartType: 'line',
      question: 'In which month was the temperature highest?',
      data: [
        { month: 'Jan', temp: 5 },
        { month: 'Feb', temp: 8 },
        { month: 'Mar', temp: 12 },
        { month: 'Apr', temp: 18 },
        { month: 'May', temp: 22 }
      ],
      xKey: 'month',
      yKey: 'temp',
      options: ['January', 'February', 'March', 'May'],
      correctAnswer: 3
    },
    {
      id: 7,
      level: 2,
      chartType: 'line',
      question: 'How many books were read in March?',
      data: [
        { month: 'Jan', books: 10 },
        { month: 'Feb', books: 15 },
        { month: 'Mar', books: 20 },
        { month: 'Apr', books: 12 }
      ],
      xKey: 'month',
      yKey: 'books',
      options: ['10', '15', '20', '12'],
      correctAnswer: 2
    },
    {
      id: 8,
      level: 2,
      chartType: 'line',
      question: 'Between which months did sales increase the most?',
      data: [
        { month: 'Week 1', sales: 100 },
        { month: 'Week 2', sales: 120 },
        { month: 'Week 3', sales: 180 },
        { month: 'Week 4', sales: 150 }
      ],
      xKey: 'month',
      yKey: 'sales',
      options: ['Week 1-2', 'Week 2-3', 'Week 3-4', 'Week 1-3'],
      correctAnswer: 1
    },
    {
      id: 9,
      level: 2,
      chartType: 'line',
      question: 'What was the rainfall in April?',
      data: [
        { month: 'Jan', rain: 45 },
        { month: 'Feb', rain: 38 },
        { month: 'Mar', rain: 52 },
        { month: 'Apr', rain: 60 },
        { month: 'May', rain: 48 }
      ],
      xKey: 'month',
      yKey: 'rain',
      options: ['45mm', '52mm', '60mm', '48mm'],
      correctAnswer: 2
    },
    {
      id: 10,
      level: 2,
      chartType: 'line',
      question: 'In which week were the fewest tickets sold?',
      data: [
        { week: 'Week 1', tickets: 250 },
        { week: 'Week 2', tickets: 180 },
        { week: 'Week 3', tickets: 320 },
        { week: 'Week 4', tickets: 290 }
      ],
      xKey: 'week',
      yKey: 'tickets',
      options: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      correctAnswer: 1
    },

    // LEVEL 3 - Pie Charts
    {
      id: 11,
      level: 3,
      chartType: 'pie',
      question: 'Which transportation method do most students use?',
      data: [
        { name: 'Bus', value: 40 },
        { name: 'Walk', value: 25 },
        { name: 'Car', value: 20 },
        { name: 'Bike', value: 15 }
      ],
      options: ['Bus', 'Walk', 'Car', 'Bike'],
      correctAnswer: 0
    },
    {
      id: 12,
      level: 3,
      chartType: 'pie',
      question: 'What percentage of the total do apples represent? (20 apples out of 100 fruits)',
      data: [
        { name: 'Apples', value: 20 },
        { name: 'Oranges', value: 30 },
        { name: 'Bananas', value: 35 },
        { name: 'Grapes', value: 15 }
      ],
      options: ['15%', '20%', '30%', '35%'],
      correctAnswer: 1
    },
    {
      id: 13,
      level: 3,
      chartType: 'pie',
      question: 'Which activity has the smallest share?',
      data: [
        { name: 'Reading', value: 30 },
        { name: 'Sports', value: 35 },
        { name: 'Gaming', value: 25 },
        { name: 'Music', value: 10 }
      ],
      options: ['Reading', 'Sports', 'Gaming', 'Music'],
      correctAnswer: 3
    },
    {
      id: 14,
      level: 3,
      chartType: 'pie',
      question: 'If 200 students were surveyed, how many chose pizza? (Pizza is 45%)',
      data: [
        { name: 'Pizza', value: 45 },
        { name: 'Burgers', value: 30 },
        { name: 'Pasta', value: 15 },
        { name: 'Salad', value: 10 }
      ],
      options: ['80', '90', '100', '110'],
      correctAnswer: 1
    },
    {
      id: 15,
      level: 3,
      chartType: 'pie',
      question: 'Which two categories together make up exactly 50%?',
      data: [
        { name: 'Dogs', value: 30 },
        { name: 'Cats', value: 20 },
        { name: 'Birds', value: 25 },
        { name: 'Fish', value: 25 }
      ],
      options: ['Dogs & Cats', 'Cats & Birds', 'Birds & Fish', 'Dogs & Fish'],
      correctAnswer: 2
    },

    // LEVEL 4 - Comparing Data
    {
      id: 16,
      level: 4,
      chartType: 'bar',
      question: 'What is the difference between the highest and lowest temperatures?',
      data: [
        { city: 'Vancouver', temp: 18 },
        { city: 'Calgary', temp: 12 },
        { city: 'Toronto', temp: 20 },
        { city: 'Montreal', temp: 15 }
      ],
      xKey: 'city',
      yKey: 'temp',
      options: ['5°C', '6°C', '8°C', '10°C'],
      correctAnswer: 2
    },
    {
      id: 17,
      level: 4,
      chartType: 'line',
      question: 'What is the average number of visitors per day?',
      data: [
        { day: 'Mon', visitors: 100 },
        { day: 'Tue', visitors: 120 },
        { day: 'Wed', visitors: 140 },
        { day: 'Thu', visitors: 100 },
        { day: 'Fri', visitors: 140 }
      ],
      xKey: 'day',
      yKey: 'visitors',
      options: ['110', '115', '120', '125'],
      correctAnswer: 2
    },
    {
      id: 18,
      level: 4,
      chartType: 'bar',
      question: 'How many more students prefer summer than winter?',
      data: [
        { season: 'Spring', students: 20 },
        { season: 'Summer', students: 35 },
        { season: 'Fall', students: 25 },
        { season: 'Winter', students: 15 }
      ],
      xKey: 'season',
      yKey: 'students',
      options: ['15', '20', '25', '30'],
      correctAnswer: 1
    },
    {
      id: 19,
      level: 4,
      chartType: 'line',
      question: 'In how many months did rainfall exceed 50mm?',
      data: [
        { month: 'May', rain: 45 },
        { month: 'Jun', rain: 55 },
        { month: 'Jul', rain: 60 },
        { month: 'Aug', rain: 48 },
        { month: 'Sep', rain: 52 }
      ],
      xKey: 'month',
      yKey: 'rain',
      options: ['2 months', '3 months', '4 months', '5 months'],
      correctAnswer: 1
    },
    {
      id: 20,
      level: 4,
      chartType: 'bar',
      question: 'Which product sold exactly twice as many units as Product A?',
      data: [
        { product: 'A', sales: 25 },
        { product: 'B', sales: 50 },
        { product: 'C', sales: 30 },
        { product: 'D', sales: 45 }
      ],
      xKey: 'product',
      yKey: 'sales',
      options: ['Product A', 'Product B', 'Product C', 'Product D'],
      correctAnswer: 1
    },

    // LEVEL 5 - Trends and Patterns
    {
      id: 21,
      level: 5,
      chartType: 'line',
      question: 'What trend does this graph show?',
      data: [
        { year: '2019', value: 100 },
        { year: '2020', value: 120 },
        { year: '2021', value: 140 },
        { year: '2022', value: 160 },
        { year: '2023', value: 180 }
      ],
      xKey: 'year',
      yKey: 'value',
      options: ['Decreasing', 'Steady increase', 'Fluctuating', 'No pattern'],
      correctAnswer: 1
    },
    {
      id: 22,
      level: 5,
      chartType: 'line',
      question: 'Predict the approximate value for June based on the trend.',
      data: [
        { month: 'Jan', value: 10 },
        { month: 'Feb', value: 15 },
        { month: 'Mar', value: 20 },
        { month: 'Apr', value: 25 },
        { month: 'May', value: 30 }
      ],
      xKey: 'month',
      yKey: 'value',
      options: ['30', '35', '40', '45'],
      correctAnswer: 1
    },
    {
      id: 23,
      level: 5,
      chartType: 'bar',
      question: 'Which quarter showed the biggest growth compared to the previous quarter?',
      data: [
        { quarter: 'Q1', revenue: 1000 },
        { quarter: 'Q2', revenue: 1200 },
        { quarter: 'Q3', revenue: 1500 },
        { quarter: 'Q4', revenue: 1650 }
      ],
      xKey: 'quarter',
      yKey: 'revenue',
      options: ['Q1', 'Q2', 'Q3', 'Q4'],
      correctAnswer: 2
    },
    {
      id: 24,
      level: 5,
      chartType: 'line',
      question: 'Between which days did the temperature drop?',
      data: [
        { day: 'Mon', temp: 22 },
        { day: 'Tue', temp: 24 },
        { day: 'Wed', temp: 20 },
        { day: 'Thu', temp: 23 },
        { day: 'Fri', temp: 25 }
      ],
      xKey: 'day',
      yKey: 'temp',
      options: ['Mon-Tue', 'Tue-Wed', 'Wed-Thu', 'Thu-Fri'],
      correctAnswer: 1
    },
    {
      id: 25,
      level: 5,
      chartType: 'bar',
      question: 'What is the median value in this data set?',
      data: [
        { item: 'A', value: 10 },
        { item: 'B', value: 20 },
        { item: 'C', value: 30 },
        { item: 'D', value: 40 },
        { item: 'E', value: 50 }
      ],
      xKey: 'item',
      yKey: 'value',
      options: ['20', '25', '30', '35'],
      correctAnswer: 2
    },

    // LEVEL 6 - Multiple Variables
    {
      id: 26,
      level: 6,
      chartType: 'bar',
      question: 'How many total goals were scored in January?',
      data: [
        { month: 'Jan', home: 15, away: 12 },
        { month: 'Feb', home: 18, away: 14 },
        { month: 'Mar', home: 20, away: 16 }
      ],
      xKey: 'month',
      yKey: 'home',
      options: ['23', '25', '27', '29'],
      correctAnswer: 2
    },
    {
      id: 27,
      level: 6,
      chartType: 'line',
      question: 'In which month was the difference between high and low temperatures greatest?',
      data: [
        { month: 'Jan', high: 10, low: 0 },
        { month: 'Feb', high: 12, low: 2 },
        { month: 'Mar', high: 18, low: 6 },
        { month: 'Apr', high: 22, low: 10 }
      ],
      xKey: 'month',
      yKey: 'high',
      options: ['January', 'February', 'March', 'April'],
      correctAnswer: 2
    },
    {
      id: 28,
      level: 6,
      chartType: 'bar',
      question: 'What is the total of all boys and girls combined?',
      data: [
        { grade: 'Grade 1', boys: 15, girls: 18 },
        { grade: 'Grade 2', boys: 20, girls: 17 },
        { grade: 'Grade 3', boys: 18, girls: 19 }
      ],
      xKey: 'grade',
      yKey: 'boys',
      options: ['100', '107', '110', '115'],
      correctAnswer: 1
    },
    {
      id: 29,
      level: 6,
      chartType: 'line',
      question: 'Which product had the most consistent sales across all months?',
      data: [
        { month: 'Jan', productA: 50, productB: 45 },
        { month: 'Feb', productA: 52, productB: 60 },
        { month: 'Mar', productA: 51, productB: 40 }
      ],
      xKey: 'month',
      yKey: 'productA',
      options: ['Product A', 'Product B', 'Both equal', 'Cannot determine'],
      correctAnswer: 0
    },
    {
      id: 30,
      level: 6,
      chartType: 'bar',
      question: 'What percentage of total sales came from online sales in Week 1? (Online: 60, Store: 40)',
      data: [
        { week: 'Week 1', online: 60, store: 40 },
        { week: 'Week 2', online: 70, store: 50 },
        { week: 'Week 3', online: 80, store: 45 }
      ],
      xKey: 'week',
      yKey: 'online',
      options: ['50%', '55%', '60%', '65%'],
      correctAnswer: 2
    },

    // LEVEL 7 - Advanced Interpretation
    {
      id: 31,
      level: 7,
      chartType: 'line',
      question: 'What is the rate of change per month?',
      data: [
        { month: 'Jan', value: 100 },
        { month: 'Feb', value: 125 },
        { month: 'Mar', value: 150 },
        { month: 'Apr', value: 175 }
      ],
      xKey: 'month',
      yKey: 'value',
      options: ['+20/month', '+25/month', '+30/month', '+35/month'],
      correctAnswer: 1
    },
    {
      id: 32,
      level: 7,
      chartType: 'bar',
      question: 'If the trend continues, estimate revenue for Store E.',
      data: [
        { store: 'A', revenue: 1000 },
        { store: 'B', revenue: 1200 },
        { store: 'C', revenue: 1400 },
        { store: 'D', revenue: 1600 }
      ],
      xKey: 'store',
      yKey: 'revenue',
      options: ['$1700', '$1800', '$1900', '$2000'],
      correctAnswer: 1
    },
    {
      id: 33,
      level: 7,
      chartType: 'pie',
      question: 'If the total budget is $10,000, how much is allocated to Marketing? (Marketing: 35%)',
      data: [
        { name: 'Marketing', value: 35 },
        { name: 'Development', value: 30 },
        { name: 'Operations', value: 20 },
        { name: 'Admin', value: 15 }
      ],
      options: ['$3000', '$3500', '$4000', '$4500'],
      correctAnswer: 1
    },
    {
      id: 34,
      level: 7,
      chartType: 'line',
      question: 'What percentage increase occurred from January to April?',
      data: [
        { month: 'Jan', value: 200 },
        { month: 'Feb', value: 220 },
        { month: 'Mar', value: 240 },
        { month: 'Apr', value: 250 }
      ],
      xKey: 'month',
      yKey: 'value',
      options: ['20%', '25%', '30%', '35%'],
      correctAnswer: 1
    },
    {
      id: 35,
      level: 7,
      chartType: 'bar',
      question: 'Which category represents exactly 1/4 of the total?',
      data: [
        { category: 'A', value: 25 },
        { category: 'B', value: 35 },
        { category: 'C', value: 20 },
        { category: 'D', value: 20 }
      ],
      xKey: 'category',
      yKey: 'value',
      options: ['Category A', 'Category B', 'Category C', 'Category D'],
      correctAnswer: 0
    },

    // LEVEL 8 - Complex Analysis
    {
      id: 36,
      level: 8,
      chartType: 'line',
      question: 'What is the moving average for the middle three months?',
      data: [
        { month: 'Jan', value: 100 },
        { month: 'Feb', value: 120 },
        { month: 'Mar', value: 140 },
        { month: 'Apr', value: 130 },
        { month: 'May', value: 150 }
      ],
      xKey: 'month',
      yKey: 'value',
      options: ['125', '130', '135', '140'],
      correctAnswer: 1
    },
    {
      id: 37,
      level: 8,
      chartType: 'bar',
      question: 'Calculate the range of this dataset.',
      data: [
        { item: 'A', value: 45 },
        { item: 'B', value: 67 },
        { item: 'C', value: 52 },
        { item: 'D', value: 78 },
        { item: 'E', value: 61 }
      ],
      xKey: 'item',
      yKey: 'value',
      options: ['30', '33', '35', '38'],
      correctAnswer: 1
    },
    {
      id: 38,
      level: 8,
      chartType: 'pie',
      question: 'What is the ratio of the largest to smallest category?',
      data: [
        { name: 'Category A', value: 40 },
        { name: 'Category B', value: 10 },
        { name: 'Category C', value: 30 },
        { name: 'Category D', value: 20 }
      ],
      options: ['2:1', '3:1', '4:1', '5:1'],
      correctAnswer: 2
    },
    {
      id: 39,
      level: 8,
      chartType: 'line',
      question: 'Identify the outlier in this dataset.',
      data: [
        { day: 'Mon', value: 50 },
        { day: 'Tue', value: 52 },
        { day: 'Wed', value: 85 },
        { day: 'Thu', value: 51 },
        { day: 'Fri', value: 53 }
      ],
      xKey: 'day',
      yKey: 'value',
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      correctAnswer: 2
    },
    {
      id: 40,
      level: 8,
      chartType: 'bar',
      question: 'What is the interquartile range (IQR) of this data? (Q1=30, Q3=70)',
      data: [
        { item: '1', value: 20 },
        { item: '2', value: 30 },
        { item: '3', value: 50 },
        { item: '4', value: 70 },
        { item: '5', value: 80 }
      ],
      xKey: 'item',
      yKey: 'value',
      options: ['30', '40', '50', '60'],
      correctAnswer: 1
    },

    // LEVEL 9 - Statistical Reasoning
    {
      id: 41,
      level: 9,
      chartType: 'line',
      question: 'Calculate the standard deviation approximate for this dataset (mean=50).',
      data: [
        { point: '1', value: 40 },
        { point: '2', value: 50 },
        { point: '3', value: 60 },
        { point: '4', value: 45 },
        { point: '5', value: 55 }
      ],
      xKey: 'point',
      yKey: 'value',
      options: ['~5', '~7', '~10', '~12'],
      correctAnswer: 1
    },
    {
      id: 42,
      level: 9,
      chartType: 'bar',
      question: 'What is the coefficient of variation if mean=100 and SD=15?',
      data: [
        { group: 'A', value: 85 },
        { group: 'B', value: 100 },
        { group: 'C', value: 115 },
        { group: 'D', value: 95 },
        { group: 'E', value: 105 }
      ],
      xKey: 'group',
      yKey: 'value',
      options: ['10%', '15%', '20%', '25%'],
      correctAnswer: 1
    },
    {
      id: 43,
      level: 9,
      chartType: 'line',
      question: 'What correlation does this graph show between x and y?',
      data: [
        { x: 10, y: 100 },
        { x: 20, y: 80 },
        { x: 30, y: 60 },
        { x: 40, y: 40 },
        { x: 50, y: 20 }
      ],
      xKey: 'x',
      yKey: 'y',
      options: ['Positive', 'Negative', 'No correlation', 'Weak positive'],
      correctAnswer: 1
    },
    {
      id: 44,
      level: 9,
      chartType: 'pie',
      question: 'If we combine the two smallest categories, what percentage do they represent together?',
      data: [
        { name: 'A', value: 40 },
        { name: 'B', value: 30 },
        { name: 'C', value: 15 },
        { name: 'D', value: 15 }
      ],
      options: ['25%', '30%', '35%', '40%'],
      correctAnswer: 1
    },
    {
      id: 45,
      level: 9,
      chartType: 'bar',
      question: 'What is the z-score for value 130 if mean=100 and SD=15?',
      data: [
        { item: 'A', value: 70 },
        { item: 'B', value: 100 },
        { item: 'C', value: 130 },
        { item: 'D', value: 85 },
        { item: 'E', value: 115 }
      ],
      xKey: 'item',
      yKey: 'value',
      options: ['z = 1', 'z = 2', 'z = 3', 'z = 4'],
      correctAnswer: 1
    },

    // LEVEL 10 - Expert Analysis
    {
      id: 46,
      level: 10,
      chartType: 'line',
      question: 'Based on linear regression, predict the value at x=60.',
      data: [
        { x: 10, y: 20 },
        { x: 20, y: 30 },
        { x: 30, y: 40 },
        { x: 40, y: 50 },
        { x: 50, y: 60 }
      ],
      xKey: 'x',
      yKey: 'y',
      options: ['65', '70', '75', '80'],
      correctAnswer: 1
    },
    {
      id: 47,
      level: 10,
      chartType: 'bar',
      question: 'Calculate the weighted average if A=2x weight, B=1x, C=1x, D=1x.',
      data: [
        { category: 'A', value: 80 },
        { category: 'B', value: 60 },
        { category: 'C', value: 70 },
        { category: 'D', value: 50 }
      ],
      xKey: 'category',
      yKey: 'value',
      options: ['65', '68', '70', '72'],
      correctAnswer: 1
    },
    {
      id: 48,
      level: 10,
      chartType: 'line',
      question: 'What is the compound annual growth rate (CAGR) from Year 1 to Year 4?',
      data: [
        { year: 'Y1', value: 1000 },
        { year: 'Y2', value: 1200 },
        { year: 'Y3', value: 1440 },
        { year: 'Y4', value: 1728 }
      ],
      xKey: 'year',
      yKey: 'value',
      options: ['15%', '20%', '25%', '30%'],
      correctAnswer: 1
    },
    {
      id: 49,
      level: 10,
      chartType: 'pie',
      question: 'If margin of error is ±3%, what is the confidence interval for Category A (35%)?',
      data: [
        { name: 'A', value: 35 },
        { name: 'B', value: 25 },
        { name: 'C', value: 20 },
        { name: 'D', value: 20 }
      ],
      options: ['30-38%', '32-38%', '33-37%', '34-36%'],
      correctAnswer: 1
    },
    {
      id: 50,
      level: 10,
      chartType: 'bar',
      question: 'Using the 68-95-99.7 rule, what percentage of data falls within 2 SD of mean (100)?',
      data: [
        { range: '70-85', count: 5 },
        { range: '85-100', count: 34 },
        { range: '100-115', count: 34 },
        { range: '115-130', count: 5 }
      ],
      xKey: 'range',
      yKey: 'count',
      options: ['68%', '85%', '95%', '99.7%'],
      correctAnswer: 2
    }
  ];

  useEffect(() => {
    const levelQuestions = questions.filter(q => q.level === currentLevel);
    const shuffled = shuffleArray(levelQuestions);
    setShuffledQuestions(shuffled);
  }, [currentLevel]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const levelQuestions = questions.filter(q => q.level === currentLevel);
  const levelProgress = levelQuestions.findIndex(q => q.id === currentQuestion?.id) + 1;

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    setQuestionsAnswered(prev => prev + 1);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    recordAnswer('numeracy', isCorrect);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + (currentLevel * 10));
      
      // Play explosion sound for correct answer
      playExplosionSound();
    }

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];

      if (!nextQuestion || nextQuestion.level !== currentLevel) {
        // Level complete
        setLevelComplete(true);
      } else {
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 2000);
  };

  // Explosion sound effect using Web Audio API
  const playExplosionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for explosion
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start with low frequency and quickly drop
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
      
      // Volume envelope for explosion
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.type = 'sawtooth';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  const nextLevel = () => {
    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
      setCurrentQuestionIndex(questions.findIndex(q => q.level === currentLevel + 1));
      setLevelComplete(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const renderChart = () => {
    if (!currentQuestion) return null;

    const { chartType, data, xKey, yKey } = currentQuestion;

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey={xKey} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Bar dataKey={yKey} fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey={xKey} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPie>
        </ResponsiveContainer>
      );
    }
  };

  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
        >
          <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-4xl font-bold mb-4 text-purple-600">
            <TextWithVoice>All Levels Complete! 🎉</TextWithVoice>
          </h1>
          <div className="space-y-3 mb-6">
            <div className="text-2xl font-bold text-gray-800">Final Score: {score}</div>
            <div className="text-xl text-gray-600">Accuracy: {accuracy}%</div>
          </div>
          <Button onClick={onBack} className="w-full bg-purple-600 hover:bg-purple-700">
            Back to Games
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 pb-4">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -1000],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
          >
            <BarChart3 className="w-8 h-8 text-white/20" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 py-3">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center justify-between mb-3">
            <Button variant="outline" onClick={onBack} className="bg-white/90 backdrop-blur-sm h-9 text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </motion.div>
              <div className="flex-1">
                <h1 className="text-2xl text-purple-600">
                  <TextWithVoice>Chart Challenge</TextWithVoice>
                </h1>
                <p className="text-xs text-gray-600">
                  <TextWithVoice>Analyze charts and answer!</TextWithVoice>
                </p>
              </div>
            </div>

            {/* Compact Level and Progress */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 text-white">
                <div className="text-xs mb-0.5">Level</div>
                <div className="text-2xl font-bold">{currentLevel}/10</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-white">
                <div className="text-xs mb-0.5">Question</div>
                <div className="text-2xl font-bold">{levelProgress}/{levelQuestions.length}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 text-white">
                <div className="text-xs mb-0.5">Correct</div>
                <div className="text-2xl font-bold">{correctAnswers}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-2 text-white">
                <div className="text-xs mb-0.5">Accuracy</div>
                <div className="text-2xl font-bold">{accuracy}%</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Level Complete Modal */}
        <AnimatePresence>
          {levelComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
                className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl max-w-md w-full border-4 border-yellow-500"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-center mb-4"
                >
                  <Trophy className="w-24 h-24 mx-auto text-white drop-shadow-lg" />
                </motion.div>

                <h2 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
                  <TextWithVoice>Level {currentLevel} Complete!</TextWithVoice>
                </h2>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6">
                  <div className="text-2xl font-bold text-purple-600 text-center">
                    {currentLevel < 10 ? 'Ready for the next challenge?' : 'You finished all levels!'}
                  </div>
                </div>

                {currentLevel < 10 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextLevel}
                    className="w-full bg-white text-orange-600 font-bold py-4 rounded-xl shadow-lg text-lg flex items-center justify-center gap-2"
                  >
                    Next Level <ChevronRight className="w-6 h-6" />
                  </motion.button>
                ) : (
                  <Button onClick={onBack} className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold py-4 text-lg">
                    Back to Games
                  </Button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl"
          >
            {/* Question */}
            <div className="mb-3">
              <div className="flex items-start gap-2 mb-3">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {levelProgress}
                </div>
                <h2 className="text-xl font-bold text-gray-800 flex-1">
                  <TextWithVoice>{currentQuestion.question}</TextWithVoice>
                </h2>
              </div>
            </div>

            {/* Compact Chart */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200"
            >
              {renderChart()}
            </motion.div>

            {/* Compact Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = showFeedback && isSelected;

                return (
                  <motion.button
                    key={index}
                    whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    className={`
                      p-4 rounded-lg font-bold text-base text-left transition-all
                      ${!showFeedback ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg' : ''}
                      ${showResult && isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : ''}
                      ${showResult && !isCorrect ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' : ''}
                      ${showFeedback && !isSelected ? 'bg-gray-300 text-gray-500 opacity-50' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                        >
                          {isCorrect ? '✓' : '✗'}
                        </motion.span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}