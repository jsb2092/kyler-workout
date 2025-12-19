import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, Dumbbell, Target, TrendingUp, Play, Pause, RotateCcw, X, Timer } from 'lucide-react';

const WorkoutApp = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerData, setTimerData] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerType, setTimerType] = useState('warmup');
  const [streak, setStreak] = useState(0);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  const parseExercises = (name, type) => {
    const prefix = type === 'warmup' ? 'Warm-up:' : 'Cool-down:';
    const parts = name.replace(prefix, '').split(',').map(e => e.trim()).filter(e => e);
    return parts.length > 0 ? parts : [name];
  };

  const startTimer = (exercise, type = 'warmup') => {
    const exercises = parseExercises(exercise.name, type);
    const timePerExercise = Math.floor(120 / exercises.length);
    setTimerData({ exercises, timePerExercise, totalTime: 120 });
    setCurrentExerciseIndex(0);
    setTimeRemaining(timePerExercise);
    setIsPaused(false);
    setTimerType(type);
    setTimerActive(true);
  };

  const closeTimer = () => {
    setTimerActive(false);
    setTimerData(null);
    setCurrentExerciseIndex(0);
    setTimeRemaining(0);
    setIsPaused(false);
  };

  const resetTimer = () => {
    if (timerData) {
      setCurrentExerciseIndex(0);
      setTimeRemaining(timerData.timePerExercise);
      setIsPaused(false);
    }
  };

  const parseDuration = (durationStr) => {
    if (!durationStr) return null;
    const match = durationStr.match(/(\d+)(?:-(\d+))?\s*sec/);
    if (match) return match[2] ? parseInt(match[2]) : parseInt(match[1]);
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (minMatch) return parseInt(minMatch[1]) * 60;
    return null;
  };

  const startExerciseTimer = (exercise) => {
    const duration = parseDuration(exercise.sets || exercise.duration);
    if (!duration) return;
    setTimerData({ exercises: [exercise.name], timePerExercise: duration, totalTime: duration });
    setCurrentExerciseIndex(0);
    setTimeRemaining(duration);
    setIsPaused(false);
    setTimerType('exercise');
    setTimerActive(true);
  };

  const hasTimedSets = (exercise) => {
    const str = exercise.sets || exercise.duration || '';
    return str.includes('sec') && !exercise.isWarmup && !exercise.isCooldown && !exercise.isStretch;
  };

  const completeWorkout = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lastWorkoutDate) {
      const lastDate = new Date(lastWorkoutDate);
      lastDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      if (daysDiff > 2) {
        setStreak(1);
      } else if (daysDiff >= 1) {
        setStreak(prev => prev + 1);
      }
    } else {
      setStreak(1);
    }
    setLastWorkoutDate(today.toISOString());
    setShowStreakCelebration(true);
    setTimeout(() => setShowStreakCelebration(false), 3000);
  };

  useEffect(() => {
    let interval;
    if (timerActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timerActive && !isPaused && timeRemaining === 0 && timerData) {
      if (currentExerciseIndex < timerData.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setTimeRemaining(timerData.timePerExercise);
      } else {
        setIsPaused(true);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, isPaused, timeRemaining, currentExerciseIndex, timerData]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!timerData) return 0;
    const elapsed = (timerData.timePerExercise - timeRemaining) + (currentExerciseIndex * timerData.timePerExercise);
    return (elapsed / timerData.totalTime) * 100;
  };

  const workoutData = {
    monday: {
      name: "Monday", title: "Upper Body Push", color: "bg-blue-500",
      exercises: [
        { name: "Warm-up: Arm circles, Jumping jacks", duration: "2 min", muscles: "Shoulders, Cardio", description: "Extend your arms out to the sides. Make small circles forward, gradually getting bigger. After 10-15 seconds, switch to backward circles. Then do jumping jacks to get your heart rate up.", easier: "Do slower, smaller movements", harder: "Increase speed and range of motion", isWarmup: true },
        { name: "Wall Push-ups", sets: "3 × 10-15", muscles: "Chest, Shoulders, Triceps", description: "Stand facing a wall about arm's length away. Place your hands on the wall at shoulder height, slightly wider than your shoulders. Keep your body straight and lean toward the wall by bending your elbows. Push back to the starting position.", easier: "Stand closer to the wall for less resistance", harder: "Stand further from the wall, or move to incline push-ups" },
        { name: "Plank", sets: "3 × 20-30 sec", muscles: "Core, Shoulders, Back", description: "Get in a push-up position but rest on your forearms instead of your hands. Keep your body in a straight line from head to heels. Hold this position while breathing normally.", easier: "Do on knees, or hold for shorter time (10-15 sec)", harder: "Hold for 45-60 seconds, or add leg lifts" },
        { name: "Incline Push-ups", sets: "4 × 8-12", muscles: "Chest, Shoulders, Triceps, Core", description: "Place your hands on an elevated surface like a chair or bench. Step your feet back so your body forms a straight line. Lower your chest toward the surface, then push back up.", easier: "Use a higher surface (kitchen counter)", harder: "Use a lower surface (stairs), or do regular push-ups" },
        { name: "Dead Bug", sets: "3 × 6 each side", muscles: "Core, Hip Flexors", description: "Lie on your back with arms pointing straight up and knees bent at 90 degrees. Slowly lower one arm behind your head while extending the opposite leg straight out. Return and switch sides.", easier: "Keep leg bent instead of straightening it", harder: "Move slower, or hold each position for 2-3 seconds" },
        { name: "Pike Push-ups", sets: "3 × 6-8", muscles: "Shoulders, Upper Chest, Triceps", description: "Start in a push-up position, then walk your feet toward your hands so your body makes an upside-down 'V' shape. Bend your elbows and lower the top of your head toward the floor, then push back up.", easier: "Don't go as low, keep legs wider", harder: "Elevate your feet on a chair or bench" },
        { name: "Cool-down: Chest stretch, Shoulder stretch, Tricep stretch", duration: "2 min", muscles: "Chest, Shoulders, Triceps", description: "Hold each stretch for 20-30 seconds. For chest: clasp hands behind back and lift. For shoulders: pull one arm across your body. For triceps: reach one arm overhead and bend elbow, gently push with other hand.", easier: "Hold stretches for shorter time", harder: "Hold stretches for 30-45 seconds, go deeper", isCooldown: true }
      ]
    },
    tuesday: {
      name: "Tuesday", title: "Lower Body", color: "bg-orange-500",
      exercises: [
        { name: "Warm-up: High knees, Butt kicks", duration: "2 min", muscles: "Hip Flexors, Hamstrings, Cardio", description: "Run in place bringing your knees up high toward your chest. Then switch to kicking your heels up toward your butt with each step.", easier: "Go slower, march instead of run", harder: "Increase speed and height", isWarmup: true },
        { name: "Squats", sets: "3 × 12", muscles: "Quads, Glutes, Hamstrings, Core", description: "Stand with feet shoulder-width apart. Bend your knees and push your hips back like you're sitting in a chair. Go down until your thighs are parallel to the floor, then stand back up.", easier: "Don't go as low, or hold onto something for balance", harder: "Add a pause at the bottom, or do jump squats" },
        { name: "Calf Raises", sets: "3 × 12", muscles: "Calves", description: "Stand on flat ground. Rise up onto your tiptoes as high as you can, then lower back down slowly.", easier: "Do them seated, or hold onto wall", harder: "Do on one leg, or on the edge of a stair for more range" },
        { name: "Lunges", sets: "3 × 8 each leg", muscles: "Quads, Glutes, Hamstrings, Calves", description: "Stand tall, then take a big step forward with one leg. Bend both knees until your back knee almost touches the floor. Push back up to standing. Switch legs.", easier: "Hold onto something for balance, or do shorter lunges", harder: "Add a jump between lunges (jumping lunges)" },
        { name: "Glute Bridges", sets: "3 × 10", muscles: "Glutes, Hamstrings, Lower Back", description: "Lie on your back with knees bent and feet flat on the floor. Push through your heels to lift your hips up toward the ceiling, squeezing your butt at the top. Lower back down slowly.", easier: "Reduce range of motion", harder: "Hold at the top for 3-5 seconds, or do single-leg bridges" },
        { name: "Cool-down: Quad stretch, Hamstring stretch, Calf stretch", duration: "2 min", muscles: "Quads, Hamstrings, Calves", description: "Hold each stretch for 20-30 seconds. For quads: stand on one leg, pull other foot to butt. For hamstrings: sit and reach for toes. For calves: step one foot back, press heel down.", easier: "Hold stretches for shorter time", harder: "Hold stretches for 30-45 seconds, go deeper", isCooldown: true }
      ]
    },
    wednesday: {
      name: "Wednesday", title: "Rest Day 😴", color: "bg-gray-500",
      exercises: [
        { name: "Rest & Recovery", duration: "All day", muscles: "Full Body Recovery", description: "Take the day off! Light stretching is okay if you feel like it. Rest is when your muscles grow stronger.", easier: "Complete rest - no activity", harder: "Do all the stretches below" },
        { name: "Upper Body Stretches", category: true },
        { name: "Neck Rolls", duration: "30 sec", muscles: "Neck", description: "Slowly roll your head in a circle, dropping your ear toward your shoulder, then chin to chest, then to the other shoulder. Do 5 circles each direction.", easier: "Smaller, slower circles", harder: "Hold each position for 5 seconds", isStretch: true },
        { name: "Shoulder Circles", duration: "30 sec", muscles: "Shoulders, Upper Back", description: "Roll your shoulders forward in big circles 10 times, then backward 10 times. Keep your arms relaxed at your sides.", easier: "Smaller circles", harder: "Add arm raises with circles", isStretch: true },
        { name: "Cross-Body Shoulder Stretch", duration: "30 sec each", muscles: "Shoulders, Upper Back", description: "Pull one arm across your chest with your other hand. Hold for 15-30 seconds, then switch arms.", easier: "Gentle pull, less range", harder: "Hold for 45 seconds each side", isStretch: true },
        { name: "Tricep Stretch", duration: "30 sec each", muscles: "Triceps, Shoulders", description: "Reach one arm overhead, bend the elbow so your hand drops behind your head. Use your other hand to gently push the elbow back. Switch sides.", easier: "Don't push as deep", harder: "Hold for 45 seconds each side", isStretch: true },
        { name: "Chest Doorway Stretch", duration: "30 sec", muscles: "Chest, Front Shoulders", description: "Stand in a doorway with your forearm against the frame, elbow at shoulder height. Lean forward gently until you feel a stretch in your chest.", easier: "Less lean, arm lower", harder: "Try different arm angles (high, medium, low)", isStretch: true },
        { name: "Core & Back Stretches", category: true },
        { name: "Cat-Cow Stretch", duration: "1 min", muscles: "Spine, Core, Back", description: "On hands and knees, alternate between arching your back up (cat) and dropping your belly down while lifting your head (cow). Move slowly with your breath.", easier: "Smaller range of motion", harder: "Hold each position for 3-5 seconds", isStretch: true },
        { name: "Child's Pose", duration: "30-60 sec", muscles: "Lower Back, Lats, Hips", description: "Kneel on the floor, sit back on your heels, then fold forward with arms extended in front of you. Rest your forehead on the floor and breathe deeply.", easier: "Put a pillow under your chest", harder: "Walk hands to each side for lat stretch", isStretch: true },
        { name: "Seated Spinal Twist", duration: "30 sec each", muscles: "Spine, Obliques, Hips", description: "Sit with legs extended. Bend one knee and cross it over the other leg. Twist your torso toward the bent knee, using your opposite elbow to push against it.", easier: "Keep bottom leg bent", harder: "Twist deeper, hold longer", isStretch: true },
        { name: "Cobra Stretch", duration: "30 sec", muscles: "Abs, Hip Flexors, Chest", description: "Lie face down, place hands under shoulders. Press up to lift your chest while keeping hips on the ground. Look slightly upward.", easier: "Keep elbows bent (baby cobra)", harder: "Straighten arms fully", isStretch: true },
        { name: "Lower Body Stretches", category: true },
        { name: "Standing Quad Stretch", duration: "30 sec each", muscles: "Quadriceps", description: "Stand on one leg (hold something for balance). Grab your other ankle and pull your heel toward your butt. Keep knees close together.", easier: "Use a wall for balance", harder: "Pull heel closer, push hips forward", isStretch: true },
        { name: "Seated Hamstring Stretch", duration: "30 sec each", muscles: "Hamstrings, Lower Back", description: "Sit with one leg extended, other foot against inner thigh. Reach toward your toes on the extended leg, keeping your back straight.", easier: "Use a towel around your foot", harder: "Grab your foot and hold", isStretch: true },
        { name: "Butterfly Stretch", duration: "30-60 sec", muscles: "Inner Thighs, Hips", description: "Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor.", easier: "Feet further from body", harder: "Lean forward, feet closer to body", isStretch: true },
        { name: "Figure-4 Stretch", duration: "30 sec each", muscles: "Glutes, Hips, Piriformis", description: "Lie on your back. Cross one ankle over the opposite knee. Pull the uncrossed leg toward your chest until you feel a stretch in your hip/glute.", easier: "Keep foot on floor instead of pulling", harder: "Pull knee closer to chest", isStretch: true },
        { name: "Calf Stretch", duration: "30 sec each", muscles: "Calves, Achilles", description: "Stand facing a wall. Step one foot back, keeping it straight with heel on the ground. Lean into the wall until you feel a stretch in your back calf.", easier: "Smaller step back", harder: "Bend back knee slightly for deeper stretch", isStretch: true },
        { name: "Hip Flexor Lunge Stretch", duration: "30 sec each", muscles: "Hip Flexors, Quads", description: "Kneel on one knee with the other foot in front (lunge position). Push your hips forward while keeping your torso upright.", easier: "Use a pillow under your knee", harder: "Raise the arm on the kneeling side overhead", isStretch: true }
      ]
    },
    thursday: {
      name: "Thursday", title: "Upper Body Pull + Core", color: "bg-green-500",
      exercises: [
        { name: "Warm-up: Arm swings, Jumping jacks", duration: "2 min", muscles: "Shoulders, Upper Back, Cardio", description: "Swing both arms forward and up, then back and down in big sweeping motions. Also do horizontal swings. Finish with jumping jacks.", easier: "Slower movements, smaller range", harder: "Increase speed and add dynamic stretches", isWarmup: true },
        { name: "Dead Hangs", sets: "3 × 15-30 sec", muscles: "Grip, Forearms, Lats, Shoulders", description: "Grab your pull-up bar with both hands. Hang with your arms fully straight and feet off the ground. Hold for as long as you can.", easier: "Start with 5-10 seconds, use a chair for support", harder: "Hold for 45+ seconds, or add scapular pulls" },
        { name: "Seated Leg Lifts", sets: "3 × 8-10 reps", muscles: "Hip Flexors, Core, Triceps", description: "Sit on the floor with legs straight out. Place hands flat beside your hips. Press down through your hands and try to lift your legs off the ground.", easier: "Bend your knees, or just press without lifting", harder: "Hold legs up for 3-5 seconds, or progress to tuck hold" },
        { name: "Negative Pull-Ups", sets: "3 × 3-5 reps", muscles: "Lats, Biceps, Upper Back, Grip", description: "Jump or step up so your chin is above the bar. Slowly lower yourself down as controlled as possible, taking 3-5 seconds to reach the bottom.", easier: "Use a chair for more assistance", harder: "Lower for 5-8 seconds, or add a pause halfway down" },
        { name: "Hollow Body Hold", sets: "3 × 10-15 sec", muscles: "Core, Hip Flexors", description: "Lie on your back. Lift your shoulders and legs slightly off the ground, arms reaching past your hips. Your body should make a banana shape.", easier: "Keep knees bent or don't lift as high", harder: "Hold for 20-30 seconds, or add small rocks" },
        { name: "Table Rows", sets: "3 × 8-10", muscles: "Upper Back, Lats, Biceps, Core", description: "Lie underneath a sturdy table and grab the edge with both hands. Pull your chest up toward the table by squeezing your shoulder blades together.", easier: "Bend your knees and put feet flat on floor", harder: "Elevate your feet on a chair" },
        { name: "Superman Hold", sets: "3 × 10-15 sec", muscles: "Lower Back, Glutes, Upper Back", description: "Lie face down with arms stretched out in front of you. Lift your arms, chest, and legs off the floor at the same time.", easier: "Lift just arms or just legs, not both", harder: "Hold for 20-30 seconds" },
        { name: "Cool-down: Lat stretch, Back stretch, Bicep stretch", duration: "2 min", muscles: "Lats, Back, Biceps", description: "Hold each stretch for 20-30 seconds. For lats: reach one arm overhead and lean to opposite side. For back: cat-cow stretches on all fours. For biceps: extend arm, palm up, gently pull fingers back.", easier: "Hold stretches for shorter time", harder: "Hold stretches for 30-45 seconds, go deeper", isCooldown: true }
      ]
    },
    friday: {
      name: "Friday", title: "Cardio + Full Body", color: "bg-red-500",
      exercises: [
        { name: "Warm-up: Jogging in place, Arm circles", duration: "2 min", muscles: "Full Body", description: "Do light jogging in place and arm circles to get your blood flowing and muscles warm.", easier: "Gentle walking and arm movements", harder: "Add dynamic stretches and high knees", isWarmup: true },
        { name: "Jumping Jacks", sets: "2 × 30 sec", muscles: "Cardio, Full Body, Shoulders", description: "Jump your feet out wide while raising your arms overhead, then jump back to the starting position.", easier: "Step out instead of jump", harder: "Go faster, or do for 45 seconds" },
        { name: "Squats", sets: "2 × 10", muscles: "Quads, Glutes, Hamstrings, Core", description: "Stand with feet shoulder-width apart. Bend your knees and push your hips back. Go down until thighs are parallel to the floor.", easier: "Don't go as low", harder: "Add a jump at the top" },
        { name: "Mountain Climbers", sets: "2 × 15 sec", muscles: "Cardio, Core, Shoulders", description: "Start in a push-up position. Bring one knee toward your chest, then quickly switch legs like you're running horizontally.", easier: "Go slower, or step instead of jump", harder: "Go faster, or do for 30 seconds" },
        { name: "Push-ups", sets: "2 × 8", muscles: "Chest, Shoulders, Triceps, Core", description: "Start in a plank position. Lower your chest toward the floor by bending your elbows, keeping your body straight. Push back up.", easier: "Do wall or incline push-ups", harder: "Do regular floor push-ups" },
        { name: "Burpees", sets: "2 × 5", muscles: "Full Body, Cardio", description: "From standing, squat down and put hands on the floor. Jump feet back into push-up position. Jump feet back toward hands. Stand up and jump.", easier: "Skip the push-up, step instead of jump", harder: "Add a full push-up, jump higher" },
        { name: "Cool-down: Full body stretch, Deep breathing", duration: "2 min", muscles: "Full Body", description: "Do gentle full body stretches: reach for toes, twist torso side to side, neck rolls, and finish with deep breathing. Inhale for 4 counts, hold for 4, exhale for 4.", easier: "Focus mainly on breathing", harder: "Add yoga poses like downward dog and child's pose", isCooldown: true }
      ]
    },
    saturday: {
      name: "Saturday", title: "Active Fun Day", color: "bg-purple-500",
      exercises: [
        { name: "Active Fun Activity", duration: "15-20 min", muscles: "Full Body", description: "Do something fun and active! YouTube workout, sports, games, or skip it if you need rest.", easier: "Take it as a rest day", harder: "Do 30-45 minutes of activity" }
      ]
    },
    sunday: {
      name: "Sunday", title: "Rest Day 😴", color: "bg-gray-500",
      exercises: [
        { name: "Rest & Recovery", duration: "All day", muscles: "Full Body Recovery", description: "Full rest day. Relax, stretch if you want, and get ready for next week!", easier: "Complete rest", harder: "Do all the stretches below" },
        { name: "Upper Body Stretches", category: true },
        { name: "Neck Rolls", duration: "30 sec", muscles: "Neck", description: "Slowly roll your head in a circle, dropping your ear toward your shoulder, then chin to chest, then to the other shoulder. Do 5 circles each direction.", easier: "Smaller, slower circles", harder: "Hold each position for 5 seconds", isStretch: true },
        { name: "Shoulder Circles", duration: "30 sec", muscles: "Shoulders, Upper Back", description: "Roll your shoulders forward in big circles 10 times, then backward 10 times. Keep your arms relaxed at your sides.", easier: "Smaller circles", harder: "Add arm raises with circles", isStretch: true },
        { name: "Cross-Body Shoulder Stretch", duration: "30 sec each", muscles: "Shoulders, Upper Back", description: "Pull one arm across your chest with your other hand. Hold for 15-30 seconds, then switch arms.", easier: "Gentle pull, less range", harder: "Hold for 45 seconds each side", isStretch: true },
        { name: "Tricep Stretch", duration: "30 sec each", muscles: "Triceps, Shoulders", description: "Reach one arm overhead, bend the elbow so your hand drops behind your head. Use your other hand to gently push the elbow back. Switch sides.", easier: "Don't push as deep", harder: "Hold for 45 seconds each side", isStretch: true },
        { name: "Chest Doorway Stretch", duration: "30 sec", muscles: "Chest, Front Shoulders", description: "Stand in a doorway with your forearm against the frame, elbow at shoulder height. Lean forward gently until you feel a stretch in your chest.", easier: "Less lean, arm lower", harder: "Try different arm angles (high, medium, low)", isStretch: true },
        { name: "Core & Back Stretches", category: true },
        { name: "Cat-Cow Stretch", duration: "1 min", muscles: "Spine, Core, Back", description: "On hands and knees, alternate between arching your back up (cat) and dropping your belly down while lifting your head (cow). Move slowly with your breath.", easier: "Smaller range of motion", harder: "Hold each position for 3-5 seconds", isStretch: true },
        { name: "Child's Pose", duration: "30-60 sec", muscles: "Lower Back, Lats, Hips", description: "Kneel on the floor, sit back on your heels, then fold forward with arms extended in front of you. Rest your forehead on the floor and breathe deeply.", easier: "Put a pillow under your chest", harder: "Walk hands to each side for lat stretch", isStretch: true },
        { name: "Seated Spinal Twist", duration: "30 sec each", muscles: "Spine, Obliques, Hips", description: "Sit with legs extended. Bend one knee and cross it over the other leg. Twist your torso toward the bent knee, using your opposite elbow to push against it.", easier: "Keep bottom leg bent", harder: "Twist deeper, hold longer", isStretch: true },
        { name: "Cobra Stretch", duration: "30 sec", muscles: "Abs, Hip Flexors, Chest", description: "Lie face down, place hands under shoulders. Press up to lift your chest while keeping hips on the ground. Look slightly upward.", easier: "Keep elbows bent (baby cobra)", harder: "Straighten arms fully", isStretch: true },
        { name: "Lower Body Stretches", category: true },
        { name: "Standing Quad Stretch", duration: "30 sec each", muscles: "Quadriceps", description: "Stand on one leg (hold something for balance). Grab your other ankle and pull your heel toward your butt. Keep knees close together.", easier: "Use a wall for balance", harder: "Pull heel closer, push hips forward", isStretch: true },
        { name: "Seated Hamstring Stretch", duration: "30 sec each", muscles: "Hamstrings, Lower Back", description: "Sit with one leg extended, other foot against inner thigh. Reach toward your toes on the extended leg, keeping your back straight.", easier: "Use a towel around your foot", harder: "Grab your foot and hold", isStretch: true },
        { name: "Butterfly Stretch", duration: "30-60 sec", muscles: "Inner Thighs, Hips", description: "Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor.", easier: "Feet further from body", harder: "Lean forward, feet closer to body", isStretch: true },
        { name: "Figure-4 Stretch", duration: "30 sec each", muscles: "Glutes, Hips, Piriformis", description: "Lie on your back. Cross one ankle over the opposite knee. Pull the uncrossed leg toward your chest until you feel a stretch in your hip/glute.", easier: "Keep foot on floor instead of pulling", harder: "Pull knee closer to chest", isStretch: true },
        { name: "Calf Stretch", duration: "30 sec each", muscles: "Calves, Achilles", description: "Stand facing a wall. Step one foot back, keeping it straight with heel on the ground. Lean into the wall until you feel a stretch in your back calf.", easier: "Smaller step back", harder: "Bend back knee slightly for deeper stretch", isStretch: true },
        { name: "Hip Flexor Lunge Stretch", duration: "30 sec each", muscles: "Hip Flexors, Quads", description: "Kneel on one knee with the other foot in front (lunge position). Push your hips forward while keeping your torso upright.", easier: "Use a pillow under your knee", harder: "Raise the arm on the kneeling side overhead", isStretch: true }
      ]
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const isComplete = timerData && currentExerciseIndex === timerData.exercises.length - 1 && timeRemaining === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      {timerActive && timerData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-600 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Timer className={`w-6 h-6 ${timerType === 'warmup' ? 'text-green-400' : timerType === 'cooldown' ? 'text-blue-400' : 'text-yellow-400'}`} />
                {timerType === 'warmup' ? 'Warm-Up' : timerType === 'cooldown' ? 'Cool-Down' : 'Exercise'} Timer
              </h3>
              <button onClick={closeTimer} className="p-2 hover:bg-slate-700 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="text-center mb-6">
              <div className={`text-5xl font-mono font-bold mb-2 ${timeRemaining <= 5 && timeRemaining > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>{formatTime(timeRemaining)}</div>
              <div className="text-sm text-slate-500 mb-6">{timerData.timePerExercise}s per exercise</div>
              <div className={`${timerType === 'warmup' ? 'bg-green-500/20 border-green-500/40' : timerType === 'cooldown' ? 'bg-blue-500/20 border-blue-500/40' : 'bg-yellow-500/20 border-yellow-500/40'} border-2 rounded-xl p-6 mb-4`}>
                <div className="text-sm text-slate-400 mb-2">Exercise {currentExerciseIndex + 1} of {timerData.exercises.length}</div>
                <div className={`text-4xl font-bold ${timerType === 'warmup' ? 'text-green-400' : timerType === 'cooldown' ? 'text-blue-400' : 'text-yellow-400'} min-h-[80px] flex items-center justify-center`}>{timerData.exercises[currentExerciseIndex]}</div>
              </div>
              {currentExerciseIndex < timerData.exercises.length - 1 && !isComplete && (
                <div className="text-sm text-slate-500">Next: <span className="text-slate-300">{timerData.exercises[currentExerciseIndex + 1]}</span></div>
              )}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-6 overflow-hidden">
              <div className={`${timerType === 'warmup' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : timerType === 'cooldown' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-yellow-500 to-orange-400'} h-full transition-all duration-1000`} style={{ width: `${getProgress()}%` }} />
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsPaused(!isPaused)} className={`${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} p-4 rounded-full transition-colors`}>
                {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
              </button>
              <button onClick={resetTimer} className="bg-slate-600 hover:bg-slate-500 p-4 rounded-full transition-colors"><RotateCcw className="w-8 h-8" /></button>
            </div>
            {isComplete && <div className="mt-6 text-center text-green-400 text-xl font-bold animate-pulse">🎉 {timerType === 'warmup' ? 'Warm-Up' : timerType === 'cooldown' ? 'Cool-Down' : 'Exercise'} Complete!</div>}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Dumbbell className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Workout Planner</h1>
          </div>
          <p className="text-slate-400 text-lg">Your personalized weekly training program</p>
          {streak > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 px-4 py-2 rounded-full">
              <span className="text-2xl">🔥</span>
              <span className="text-orange-400 font-bold">{streak} Day Streak!</span>
            </div>
          )}
          {showStreakCelebration && <div className="mt-3 animate-bounce text-2xl">🎉 Workout Complete! Keep it up! 🎉</div>}
        </div>

        {!selectedDay && (
          <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
            <div className="flex items-center gap-2 mb-4"><Target className="w-6 h-6 text-yellow-400" /><h2 className="text-2xl font-bold">Your Goals</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Pull-ups', 'L-Sit', 'Core Strength', 'Push-ups', 'Upper & Lower Body'].map((goal, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300"><span className="text-2xl">🎯</span><span>{goal}</span></div>
              ))}
            </div>
          </div>
        )}

        {!selectedDay ? (
          <div>
            <div className="flex items-center gap-2 mb-4"><Calendar className="w-6 h-6 text-blue-400" /><h2 className="text-2xl font-bold">Select Your Workout Day</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {days.map((day) => (
                <button key={day} onClick={() => setSelectedDay(day)} className={`${workoutData[day].color} hover:opacity-90 transition-all p-6 rounded-xl shadow-lg transform hover:scale-105 text-left`}>
                  <div className="text-xl font-bold mb-1">{workoutData[day].name}</div>
                  <div className="text-sm opacity-90">{workoutData[day].title}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => { setSelectedDay(null); setExpandedExercise(null); }} className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300">← Back to Day Selection</button>
            <div className={`${workoutData[selectedDay].color} rounded-xl p-6 mb-6 shadow-lg`}>
              <h2 className="text-3xl font-bold mb-2">{workoutData[selectedDay].name}</h2>
              <p className="text-xl opacity-90">{workoutData[selectedDay].title}</p>
            </div>

            <div className="space-y-4">
              {workoutData[selectedDay].exercises.map((exercise, index) => (
                exercise.category ? (
                  <div key={index} className="pt-4 first:pt-0">
                    <h3 className="text-lg font-bold text-slate-300 border-b border-slate-600 pb-2 mb-2">{exercise.name}</h3>
                  </div>
                ) : (
                <div key={index} className={`bg-slate-800 rounded-xl border ${exercise.isWarmup ? 'border-green-500/30' : exercise.isCooldown ? 'border-blue-500/30' : exercise.isStretch ? 'border-purple-500/30' : 'border-slate-700'} overflow-hidden`}>
                  <button onClick={() => setExpandedExercise(expandedExercise === index ? null : index)} className="w-full p-5 text-left hover:bg-slate-750 transition-colors flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-lg font-semibold">{exercise.name}</span>
                        {(exercise.sets || exercise.duration) && <span className="text-blue-400 text-sm font-medium px-3 py-1 bg-blue-400/10 rounded-full">{exercise.sets || exercise.duration}</span>}
                        {exercise.isWarmup && (
                          <button onClick={(e) => { e.stopPropagation(); startTimer(exercise, 'warmup'); }} className="flex items-center gap-1 text-green-400 text-sm font-medium px-3 py-1 bg-green-400/10 rounded-full hover:bg-green-400/20 transition-colors">
                            <Timer className="w-4 h-4" />Start Timer
                          </button>
                        )}
                        {exercise.isCooldown && (
                          <button onClick={(e) => { e.stopPropagation(); startTimer(exercise, 'cooldown'); }} className="flex items-center gap-1 text-blue-400 text-sm font-medium px-3 py-1 bg-blue-400/10 rounded-full hover:bg-blue-400/20 transition-colors">
                            <Timer className="w-4 h-4" />Start Timer
                          </button>
                        )}
                        {hasTimedSets(exercise) && (
                          <button onClick={(e) => { e.stopPropagation(); startExerciseTimer(exercise); }} className="flex items-center gap-1 text-yellow-400 text-sm font-medium px-3 py-1 bg-yellow-400/10 rounded-full hover:bg-yellow-400/20 transition-colors">
                            <Timer className="w-4 h-4" />Start Timer
                          </button>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm">{exercise.muscles}</div>
                    </div>
                    {expandedExercise === index ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedExercise === index && (
                    <div className="px-5 pb-5 border-t border-slate-700 pt-4">
                      <div className="mb-4"><h4 className="text-sm font-semibold text-blue-400 mb-2">HOW TO DO IT</h4><p className="text-slate-300 leading-relaxed">{exercise.description}</p></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"><span className="text-green-400 font-semibold text-sm">EASIER VERSION</span><p className="text-slate-300 text-sm mt-2">{exercise.easier}</p></div>
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4"><div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-400" /><span className="text-orange-400 font-semibold text-sm">HARDER VERSION</span></div><p className="text-slate-300 text-sm mt-2">{exercise.harder}</p></div>
                      </div>
                    </div>
                  )}
                </div>
                )
              ))}
            </div>

            <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">💡 Important Tips</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• <strong>Form first!</strong> Do exercises correctly before adding more reps.</li>
                <li>• <strong>Listen to your body.</strong> Sore is okay, pain is not.</li>
                <li>• <strong>Drink water</strong> before, during, and after workouts.</li>
                <li>• <strong>Sleep matters!</strong> Aim for 10-12 hours — your muscles grow while you sleep!</li>
              </ul>
            </div>

            {selectedDay && !['wednesday', 'sunday'].includes(selectedDay) && (
              <div className="mt-6">
                <button onClick={completeWorkout} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-3">
                  <span className="text-2xl">✓</span>I Completed My Workout!<span className="text-2xl">💪</span>
                </button>
                {streak > 0 && <p className="text-center text-slate-400 mt-2">Current streak: {streak} day{streak !== 1 ? 's' : ''} 🔥</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutApp;