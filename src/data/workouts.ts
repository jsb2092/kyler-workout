import type { WorkoutData, DayName } from '../types';

export const workoutData: WorkoutData = {
  monday: {
    name: "Monday",
    title: "Upper Body Push",
    color: "bg-blue-500",
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
    name: "Tuesday",
    title: "Lower Body",
    color: "bg-orange-500",
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
    name: "Wednesday",
    title: "Rest Day",
    color: "bg-gray-500",
    exercises: [
      { name: "Rest & Recovery", duration: "All day", muscles: "Full Body Recovery", description: "Take the day off! Light stretching is okay if you feel like it. Rest is when your muscles grow stronger.", easier: "Complete rest - no activity", harder: "Do all the stretches below" },
      { name: "Upper Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { name: "Neck Rolls", duration: "30 sec", muscles: "Neck", description: "Slowly roll your head in a circle, dropping your ear toward your shoulder, then chin to chest, then to the other shoulder. Do 5 circles each direction.", easier: "Smaller, slower circles", harder: "Hold each position for 5 seconds", isStretch: true },
      { name: "Shoulder Circles", duration: "30 sec", muscles: "Shoulders, Upper Back", description: "Roll your shoulders forward in big circles 10 times, then backward 10 times. Keep your arms relaxed at your sides.", easier: "Smaller circles", harder: "Add arm raises with circles", isStretch: true },
      { name: "Cross-Body Shoulder Stretch", duration: "30 sec each", muscles: "Shoulders, Upper Back", description: "Pull one arm across your chest with your other hand. Hold for 15-30 seconds, then switch arms.", easier: "Gentle pull, less range", harder: "Hold for 45 seconds each side", isStretch: true },
      { name: "Tricep Stretch", duration: "30 sec each", muscles: "Triceps, Shoulders", description: "Reach one arm overhead, bend the elbow so your hand drops behind your head. Use your other hand to gently push the elbow back. Switch sides.", easier: "Don't push as deep", harder: "Hold for 45 seconds each side", isStretch: true },
      { name: "Chest Doorway Stretch", duration: "30 sec", muscles: "Chest, Front Shoulders", description: "Stand in a doorway with your forearm against the frame, elbow at shoulder height. Lean forward gently until you feel a stretch in your chest.", easier: "Less lean, arm lower", harder: "Try different arm angles (high, medium, low)", isStretch: true },
      { name: "Core & Back Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { name: "Cat-Cow Stretch", duration: "1 min", muscles: "Spine, Core, Back", description: "On hands and knees, alternate between arching your back up (cat) and dropping your belly down while lifting your head (cow). Move slowly with your breath.", easier: "Smaller range of motion", harder: "Hold each position for 3-5 seconds", isStretch: true },
      { name: "Child's Pose", duration: "30-60 sec", muscles: "Lower Back, Lats, Hips", description: "Kneel on the floor, sit back on your heels, then fold forward with arms extended in front of you. Rest your forehead on the floor and breathe deeply.", easier: "Put a pillow under your chest", harder: "Walk hands to each side for lat stretch", isStretch: true },
      { name: "Seated Spinal Twist", duration: "30 sec each", muscles: "Spine, Obliques, Hips", description: "Sit with legs extended. Bend one knee and cross it over the other leg. Twist your torso toward the bent knee, using your opposite elbow to push against it.", easier: "Keep bottom leg bent", harder: "Twist deeper, hold longer", isStretch: true },
      { name: "Cobra Stretch", duration: "30 sec", muscles: "Abs, Hip Flexors, Chest", description: "Lie face down, place hands under shoulders. Press up to lift your chest while keeping hips on the ground. Look slightly upward.", easier: "Keep elbows bent (baby cobra)", harder: "Straighten arms fully", isStretch: true },
      { name: "Lower Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { name: "Standing Quad Stretch", duration: "30 sec each", muscles: "Quadriceps", description: "Stand on one leg (hold something for balance). Grab your other ankle and pull your heel toward your butt. Keep knees close together.", easier: "Use a wall for balance", harder: "Pull heel closer, push hips forward", isStretch: true },
      { name: "Seated Hamstring Stretch", duration: "30 sec each", muscles: "Hamstrings, Lower Back", description: "Sit with one leg extended, other foot against inner thigh. Reach toward your toes on the extended leg, keeping your back straight.", easier: "Use a towel around your foot", harder: "Grab your foot and hold", isStretch: true },
      { name: "Butterfly Stretch", duration: "30-60 sec", muscles: "Inner Thighs, Hips", description: "Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor.", easier: "Feet further from body", harder: "Lean forward, feet closer to body", isStretch: true },
      { name: "Figure-4 Stretch", duration: "30 sec each", muscles: "Glutes, Hips, Piriformis", description: "Lie on your back. Cross one ankle over the opposite knee. Pull the uncrossed leg toward your chest until you feel a stretch in your hip/glute.", easier: "Keep foot on floor instead of pulling", harder: "Pull knee closer to chest", isStretch: true },
      { name: "Calf Stretch", duration: "30 sec each", muscles: "Calves, Achilles", description: "Stand facing a wall. Step one foot back, keeping it straight with heel on the ground. Lean into the wall until you feel a stretch in your back calf.", easier: "Smaller step back", harder: "Bend back knee slightly for deeper stretch", isStretch: true },
      { name: "Hip Flexor Lunge Stretch", duration: "30 sec each", muscles: "Hip Flexors, Quads", description: "Kneel on one knee with the other foot in front (lunge position). Push your hips forward while keeping your torso upright.", easier: "Use a pillow under your knee", harder: "Raise the arm on the kneeling side overhead", isStretch: true }
    ]
  },
  thursday: {
    name: "Thursday",
    title: "Upper Body Pull + Core",
    color: "bg-green-500",
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
    name: "Friday",
    title: "Cardio + Full Body",
    color: "bg-red-500",
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
    name: "Saturday",
    title: "Active Fun Day",
    color: "bg-purple-500",
    exercises: [
      { name: "Active Fun Activity", duration: "15-20 min", muscles: "Full Body", description: "Do something fun and active! YouTube workout, sports, games, or skip it if you need rest.", easier: "Take it as a rest day", harder: "Do 30-45 minutes of activity" }
    ]
  },
  sunday: {
    name: "Sunday",
    title: "Rest Day",
    color: "bg-gray-500",
    exercises: [
      { name: "Rest & Recovery", duration: "All day", muscles: "Full Body Recovery", description: "Full rest day. Relax, stretch if you want, and get ready for next week!", easier: "Complete rest", harder: "Do all the stretches below" },
      { name: "Upper Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { name: "Neck Rolls", duration: "30 sec", muscles: "Neck", description: "Slowly roll your head in a circle, dropping your ear toward your shoulder, then chin to chest, then to the other shoulder. Do 5 circles each direction.", easier: "Smaller, slower circles", harder: "Hold each position for 5 seconds", isStretch: true },
      { name: "Shoulder Circles", duration: "30 sec", muscles: "Shoulders, Upper Back", description: "Roll your shoulders forward in big circles 10 times, then backward 10 times. Keep your arms relaxed at your sides.", easier: "Smaller circles", harder: "Add arm raises with circles", isStretch: true },
      { name: "Cross-Body Shoulder Stretch", duration: "30 sec each", muscles: "Shoulders, Upper Back", description: "Pull one arm across your chest with your other hand. Hold for 15-30 seconds, then switch arms.", easier: "Gentle pull, less range", harder: "Hold for 45 seconds each side", isStretch: true },
      { name: "Tricep Stretch", duration: "30 sec each", muscles: "Triceps, Shoulders", description: "Reach one arm overhead, bend the elbow so your hand drops behind your head. Use your other hand to gently push the elbow back. Switch sides.", easier: "Don't push as deep", harder: "Hold for 45 seconds each side", isStretch: true },
      { name: "Chest Doorway Stretch", duration: "30 sec", muscles: "Chest, Front Shoulders", description: "Stand in a doorway with your forearm against the frame, elbow at shoulder height. Lean forward gently until you feel a stretch in your chest.", easier: "Less lean, arm lower", harder: "Try different arm angles (high, medium, low)", isStretch: true },
      { name: "Core & Back Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { name: "Cat-Cow Stretch", duration: "1 min", muscles: "Spine, Core, Back", description: "On hands and knees, alternate between arching your back up (cat) and dropping your belly down while lifting your head (cow). Move slowly with your breath.", easier: "Smaller range of motion", harder: "Hold each position for 3-5 seconds", isStretch: true },
      { name: "Child's Pose", duration: "30-60 sec", muscles: "Lower Back, Lats, Hips", description: "Kneel on the floor, sit back on your heels, then fold forward with arms extended in front of you. Rest your forehead on the floor and breathe deeply.", easier: "Put a pillow under your chest", harder: "Walk hands to each side for lat stretch", isStretch: true },
      { name: "Seated Spinal Twist", duration: "30 sec each", muscles: "Spine, Obliques, Hips", description: "Sit with legs extended. Bend one knee and cross it over the other leg. Twist your torso toward the bent knee, using your opposite elbow to push against it.", easier: "Keep bottom leg bent", harder: "Twist deeper, hold longer", isStretch: true },
      { name: "Cobra Stretch", duration: "30 sec", muscles: "Abs, Hip Flexors, Chest", description: "Lie face down, place hands under shoulders. Press up to lift your chest while keeping hips on the ground. Look slightly upward.", easier: "Keep elbows bent (baby cobra)", harder: "Straighten arms fully", isStretch: true },
      { name: "Lower Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { name: "Standing Quad Stretch", duration: "30 sec each", muscles: "Quadriceps", description: "Stand on one leg (hold something for balance). Grab your other ankle and pull your heel toward your butt. Keep knees close together.", easier: "Use a wall for balance", harder: "Pull heel closer, push hips forward", isStretch: true },
      { name: "Seated Hamstring Stretch", duration: "30 sec each", muscles: "Hamstrings, Lower Back", description: "Sit with one leg extended, other foot against inner thigh. Reach toward your toes on the extended leg, keeping your back straight.", easier: "Use a towel around your foot", harder: "Grab your foot and hold", isStretch: true },
      { name: "Butterfly Stretch", duration: "30-60 sec", muscles: "Inner Thighs, Hips", description: "Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor.", easier: "Feet further from body", harder: "Lean forward, feet closer to body", isStretch: true },
      { name: "Figure-4 Stretch", duration: "30 sec each", muscles: "Glutes, Hips, Piriformis", description: "Lie on your back. Cross one ankle over the opposite knee. Pull the uncrossed leg toward your chest until you feel a stretch in your hip/glute.", easier: "Keep foot on floor instead of pulling", harder: "Pull knee closer to chest", isStretch: true },
      { name: "Calf Stretch", duration: "30 sec each", muscles: "Calves, Achilles", description: "Stand facing a wall. Step one foot back, keeping it straight with heel on the ground. Lean into the wall until you feel a stretch in your back calf.", easier: "Smaller step back", harder: "Bend back knee slightly for deeper stretch", isStretch: true },
      { name: "Hip Flexor Lunge Stretch", duration: "30 sec each", muscles: "Hip Flexors, Quads", description: "Kneel on one knee with the other foot in front (lunge position). Push your hips forward while keeping your torso upright.", easier: "Use a pillow under your knee", harder: "Raise the arm on the kneeling side overhead", isStretch: true }
    ]
  }
};

export const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const REST_DAYS: DayName[] = ['wednesday', 'sunday'];

export function isRestDay(day: DayName): boolean {
  return REST_DAYS.includes(day);
}
