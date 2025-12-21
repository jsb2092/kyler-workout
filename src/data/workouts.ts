import type { WorkoutData, DayName } from '../types';

export const workoutData: WorkoutData = {
  monday: {
    name: "Monday",
    title: "Upper Body Push",
    color: "bg-blue-500",
    exercises: [
      { id: "monday-warmup", name: "Warm-up: Arm circles, Jumping jacks", duration: "2 min", muscles: "Shoulders, Cardio", description: "Extend your arms out to the sides. Make small circles forward, gradually getting bigger. After 10-15 seconds, switch to backward circles. Then do jumping jacks to get your heart rate up.", easier: "Do slower, smaller movements", harder: "Increase speed and range of motion", isWarmup: true },
      {
        id: "monday-wall-pushups",
        name: "Wall Push-ups",
        sets: "3 × 10-15",
        muscles: "Chest, Shoulders, Triceps",
        description: "Stand facing a wall about arm's length away. Place your hands on the wall at shoulder height, slightly wider than your shoulders. Keep your body straight and lean toward the wall by bending your elbows. Push back to the starting position.",
        hasVariants: true,
        easier: {
          name: "Close Wall Push-ups",
          sets: "3 × 12-15",
          muscles: "Chest, Shoulders, Triceps",
          description: "Stand just 6-12 inches from the wall. This reduces the resistance significantly, making it easier to focus on form. Place hands at shoulder height and do slow, controlled push-ups."
        },
        harder: {
          name: "Incline Push-ups (Counter)",
          sets: "3 × 8-12",
          muscles: "Chest, Shoulders, Triceps, Core",
          description: "Place your hands on a kitchen counter or sturdy table. Step feet back so your body is at an angle. Lower your chest toward the surface, keeping your body straight, then push back up."
        }
      },
      {
        id: "monday-plank",
        name: "Plank",
        sets: "3 × 20-30 sec",
        muscles: "Core, Shoulders, Back",
        description: "Get in a push-up position but rest on your forearms instead of your hands. Keep your body in a straight line from head to heels. Hold this position while breathing normally.",
        hasVariants: true,
        easier: {
          name: "Knee Plank",
          sets: "3 × 20-30 sec",
          muscles: "Core, Shoulders",
          description: "Get on your forearms with your knees on the ground instead of your toes. Keep your body in a straight line from head to knees. This reduces the load significantly while building core strength."
        },
        harder: {
          name: "Plank with Leg Lifts",
          sets: "3 × 30-45 sec",
          muscles: "Core, Shoulders, Back, Glutes",
          description: "Hold a standard plank position. Alternate lifting each leg a few inches off the ground for 2-3 seconds. This adds extra challenge to your core and glutes."
        }
      },
      {
        id: "monday-incline-pushups",
        name: "Incline Push-ups",
        sets: "4 × 8-12",
        muscles: "Chest, Shoulders, Triceps, Core",
        description: "Place your hands on an elevated surface like a chair or bench. Step your feet back so your body forms a straight line. Lower your chest toward the surface, then push back up.",
        hasVariants: true,
        easier: {
          name: "High Incline Push-ups",
          sets: "4 × 10-15",
          muscles: "Chest, Shoulders, Triceps",
          description: "Use a higher surface like a kitchen counter or dresser. The higher the surface, the easier the push-up. Focus on good form and full range of motion."
        },
        harder: {
          name: "Low Incline Push-ups",
          sets: "4 × 6-10",
          muscles: "Chest, Shoulders, Triceps, Core",
          description: "Use a lower surface like a sturdy chair seat or low step. The lower the surface, the harder the push-up. Keep your core tight and body in a straight line."
        }
      },
      {
        id: "monday-dead-bug",
        name: "Dead Bug",
        sets: "3 × 6 each side",
        muscles: "Core, Hip Flexors",
        description: "Lie on your back with arms pointing straight up and knees bent at 90 degrees. Slowly lower one arm behind your head while extending the opposite leg straight out. Return and switch sides.",
        hasVariants: true,
        easier: {
          name: "Bent Knee Dead Bug",
          sets: "3 × 6 each side",
          muscles: "Core",
          description: "Same starting position, but instead of straightening your leg, keep the knee bent as you lower your foot toward the floor. This requires less core strength while teaching the movement pattern."
        },
        harder: {
          name: "Slow Dead Bug",
          sets: "3 × 5 each side",
          muscles: "Core, Hip Flexors",
          description: "Perform the dead bug movement extra slowly, taking 3-4 seconds to extend and 3-4 seconds to return. Hold the extended position for 2 seconds. This dramatically increases time under tension."
        }
      },
      {
        id: "monday-pike-pushups",
        name: "Pike Push-ups",
        sets: "3 × 6-8",
        muscles: "Shoulders, Upper Chest, Triceps",
        description: "Start in a push-up position, then walk your feet toward your hands so your body makes an upside-down 'V' shape. Bend your elbows and lower the top of your head toward the floor, then push back up.",
        hasVariants: true,
        easier: {
          name: "Box Pike Push-ups",
          sets: "3 × 8-10",
          muscles: "Shoulders, Triceps",
          description: "Place your hands on the floor and feet on a sturdy chair or box. Walk your hands back until your hips are high. Do push-ups in this position - the elevation makes it easier to balance."
        },
        harder: {
          name: "Elevated Pike Push-ups",
          sets: "3 × 5-7",
          muscles: "Shoulders, Upper Chest, Triceps, Core",
          description: "Place your feet on a sturdy chair or bench with hands on the floor. Pike your hips up high and perform pike push-ups. The elevation increases the difficulty significantly."
        }
      },
      { id: "monday-cooldown", name: "Cool-down: Chest stretch, Shoulder stretch, Tricep stretch", duration: "2 min", muscles: "Chest, Shoulders, Triceps", description: "Hold each stretch for 20-30 seconds. For chest: clasp hands behind back and lift. For shoulders: pull one arm across your body. For triceps: reach one arm overhead and bend elbow, gently push with other hand.", easier: "Hold stretches for shorter time", harder: "Hold stretches for 30-45 seconds, go deeper", isCooldown: true }
    ]
  },
  tuesday: {
    name: "Tuesday",
    title: "Lower Body",
    color: "bg-orange-500",
    exercises: [
      { id: "tuesday-warmup", name: "Warm-up: High knees, Butt kicks", duration: "2 min", muscles: "Hip Flexors, Hamstrings, Cardio", description: "Run in place bringing your knees up high toward your chest. Then switch to kicking your heels up toward your butt with each step.", easier: "Go slower, march instead of run", harder: "Increase speed and height", isWarmup: true },
      {
        id: "tuesday-squats",
        name: "Squats",
        sets: "3 × 12",
        muscles: "Quads, Glutes, Hamstrings, Core",
        description: "Stand with feet shoulder-width apart. Bend your knees and push your hips back like you're sitting in a chair. Go down until your thighs are parallel to the floor, then stand back up.",
        hasVariants: true,
        easier: {
          name: "Box Squats",
          sets: "3 × 12",
          muscles: "Quads, Glutes, Hamstrings",
          description: "Stand in front of a chair or bench. Squat down until you lightly touch the seat, then stand back up. The target gives you confidence and ensures consistent depth."
        },
        harder: {
          name: "Pause Squats",
          sets: "3 × 10",
          muscles: "Quads, Glutes, Hamstrings, Core",
          description: "Perform a regular squat, but hold the bottom position for 3 seconds before standing back up. This removes the stretch reflex and makes your muscles work harder."
        }
      },
      {
        id: "tuesday-calf-raises",
        name: "Calf Raises",
        sets: "3 × 12",
        muscles: "Calves",
        description: "Stand on flat ground. Rise up onto your tiptoes as high as you can, then lower back down slowly.",
        hasVariants: true,
        easier: {
          name: "Seated Calf Raises",
          sets: "3 × 15",
          muscles: "Calves",
          description: "Sit in a chair with feet flat on the floor. Raise your heels as high as you can while keeping the balls of your feet on the ground. Lower slowly and repeat."
        },
        harder: {
          name: "Single-Leg Calf Raises",
          sets: "3 × 10 each leg",
          muscles: "Calves",
          description: "Stand on one foot (hold something for balance). Rise up onto your tiptoes as high as possible, then lower slowly. Complete all reps on one leg before switching."
        }
      },
      {
        id: "tuesday-lunges",
        name: "Lunges",
        sets: "3 × 8 each leg",
        muscles: "Quads, Glutes, Hamstrings, Calves",
        description: "Stand tall, then take a big step forward with one leg. Bend both knees until your back knee almost touches the floor. Push back up to standing. Switch legs.",
        hasVariants: true,
        easier: {
          name: "Assisted Lunges",
          sets: "3 × 8 each leg",
          muscles: "Quads, Glutes, Hamstrings",
          description: "Hold onto a wall or sturdy furniture for balance. Perform lunges with the support, focusing on proper form. Take shorter steps if needed."
        },
        harder: {
          name: "Walking Lunges",
          sets: "3 × 10 each leg",
          muscles: "Quads, Glutes, Hamstrings, Calves, Core",
          description: "Instead of stepping back after each lunge, step forward into the next lunge. Walk across the room in a series of lunges, alternating legs."
        }
      },
      {
        id: "tuesday-glute-bridges",
        name: "Glute Bridges",
        sets: "3 × 10",
        muscles: "Glutes, Hamstrings, Lower Back",
        description: "Lie on your back with knees bent and feet flat on the floor. Push through your heels to lift your hips up toward the ceiling, squeezing your butt at the top. Lower back down slowly.",
        hasVariants: true,
        easier: {
          name: "Partial Glute Bridges",
          sets: "3 × 12",
          muscles: "Glutes, Hamstrings",
          description: "Perform glute bridges with a smaller range of motion. Focus on squeezing your glutes at the top without lifting as high. This builds the mind-muscle connection."
        },
        harder: {
          name: "Single-Leg Glute Bridges",
          sets: "3 × 8 each leg",
          muscles: "Glutes, Hamstrings, Core",
          description: "Perform a glute bridge with one leg extended straight in the air. Push through the foot on the ground to lift your hips. Complete all reps on one side, then switch."
        }
      },
      { id: "tuesday-cooldown", name: "Cool-down: Quad stretch, Hamstring stretch, Calf stretch", duration: "2 min", muscles: "Quads, Hamstrings, Calves", description: "Hold each stretch for 20-30 seconds. For quads: stand on one leg, pull other foot to butt. For hamstrings: sit and reach for toes. For calves: step one foot back, press heel down.", easier: "Hold stretches for shorter time", harder: "Hold stretches for 30-45 seconds, go deeper", isCooldown: true }
    ]
  },
  wednesday: {
    name: "Wednesday",
    title: "Rest Day",
    color: "bg-gray-500",
    exercises: [
      { id: "wednesday-rest", name: "Rest & Recovery", duration: "All day", muscles: "Full Body Recovery", description: "Take the day off! Light stretching is okay if you feel like it. Rest is when your muscles grow stronger.", easier: "Complete rest - no activity", harder: "Do all the stretches below" },
      { id: "wednesday-upper-stretches-header", name: "Upper Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "wednesday-neck-rolls", name: "Neck Rolls", duration: "30 sec", muscles: "Neck", description: "Slowly roll your head in a circle, dropping your ear toward your shoulder, then chin to chest, then to the other shoulder. Do 5 circles each direction.", easier: "Smaller, slower circles", harder: "Hold each position for 5 seconds", isStretch: true },
      { id: "wednesday-shoulder-circles", name: "Shoulder Circles", duration: "30 sec", muscles: "Shoulders, Upper Back", description: "Roll your shoulders forward in big circles 10 times, then backward 10 times. Keep your arms relaxed at your sides.", easier: "Smaller circles", harder: "Add arm raises with circles", isStretch: true },
      { id: "wednesday-cross-body-shoulder", name: "Cross-Body Shoulder Stretch", duration: "30 sec each", muscles: "Shoulders, Upper Back", description: "Pull one arm across your chest with your other hand. Hold for 15-30 seconds, then switch arms.", easier: "Gentle pull, less range", harder: "Hold for 45 seconds each side", isStretch: true },
      { id: "wednesday-tricep-stretch", name: "Tricep Stretch", duration: "30 sec each", muscles: "Triceps, Shoulders", description: "Reach one arm overhead, bend the elbow so your hand drops behind your head. Use your other hand to gently push the elbow back. Switch sides.", easier: "Don't push as deep", harder: "Hold for 45 seconds each side", isStretch: true },
      { id: "wednesday-chest-doorway", name: "Chest Doorway Stretch", duration: "30 sec", muscles: "Chest, Front Shoulders", description: "Stand in a doorway with your forearm against the frame, elbow at shoulder height. Lean forward gently until you feel a stretch in your chest.", easier: "Less lean, arm lower", harder: "Try different arm angles (high, medium, low)", isStretch: true },
      { id: "wednesday-core-stretches-header", name: "Core & Back Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "wednesday-cat-cow", name: "Cat-Cow Stretch", duration: "1 min", muscles: "Spine, Core, Back", description: "On hands and knees, alternate between arching your back up (cat) and dropping your belly down while lifting your head (cow). Move slowly with your breath.", easier: "Smaller range of motion", harder: "Hold each position for 3-5 seconds", isStretch: true },
      { id: "wednesday-childs-pose", name: "Child's Pose", duration: "30-60 sec", muscles: "Lower Back, Lats, Hips", description: "Kneel on the floor, sit back on your heels, then fold forward with arms extended in front of you. Rest your forehead on the floor and breathe deeply.", easier: "Put a pillow under your chest", harder: "Walk hands to each side for lat stretch", isStretch: true },
      { id: "wednesday-spinal-twist", name: "Seated Spinal Twist", duration: "30 sec each", muscles: "Spine, Obliques, Hips", description: "Sit with legs extended. Bend one knee and cross it over the other leg. Twist your torso toward the bent knee, using your opposite elbow to push against it.", easier: "Keep bottom leg bent", harder: "Twist deeper, hold longer", isStretch: true },
      { id: "wednesday-cobra", name: "Cobra Stretch", duration: "30 sec", muscles: "Abs, Hip Flexors, Chest", description: "Lie face down, place hands under shoulders. Press up to lift your chest while keeping hips on the ground. Look slightly upward.", easier: "Keep elbows bent (baby cobra)", harder: "Straighten arms fully", isStretch: true },
      { id: "wednesday-lower-stretches-header", name: "Lower Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "wednesday-quad-stretch", name: "Standing Quad Stretch", duration: "30 sec each", muscles: "Quadriceps", description: "Stand on one leg (hold something for balance). Grab your other ankle and pull your heel toward your butt. Keep knees close together.", easier: "Use a wall for balance", harder: "Pull heel closer, push hips forward", isStretch: true },
      { id: "wednesday-hamstring-stretch", name: "Seated Hamstring Stretch", duration: "30 sec each", muscles: "Hamstrings, Lower Back", description: "Sit with one leg extended, other foot against inner thigh. Reach toward your toes on the extended leg, keeping your back straight.", easier: "Use a towel around your foot", harder: "Grab your foot and hold", isStretch: true },
      { id: "wednesday-butterfly", name: "Butterfly Stretch", duration: "30-60 sec", muscles: "Inner Thighs, Hips", description: "Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor.", easier: "Feet further from body", harder: "Lean forward, feet closer to body", isStretch: true },
      { id: "wednesday-figure-4", name: "Figure-4 Stretch", duration: "30 sec each", muscles: "Glutes, Hips, Piriformis", description: "Lie on your back. Cross one ankle over the opposite knee. Pull the uncrossed leg toward your chest until you feel a stretch in your hip/glute.", easier: "Keep foot on floor instead of pulling", harder: "Pull knee closer to chest", isStretch: true },
      { id: "wednesday-calf-stretch", name: "Calf Stretch", duration: "30 sec each", muscles: "Calves, Achilles", description: "Stand facing a wall. Step one foot back, keeping it straight with heel on the ground. Lean into the wall until you feel a stretch in your back calf.", easier: "Smaller step back", harder: "Bend back knee slightly for deeper stretch", isStretch: true },
      { id: "wednesday-hip-flexor", name: "Hip Flexor Lunge Stretch", duration: "30 sec each", muscles: "Hip Flexors, Quads", description: "Kneel on one knee with the other foot in front (lunge position). Push your hips forward while keeping your torso upright.", easier: "Use a pillow under your knee", harder: "Raise the arm on the kneeling side overhead", isStretch: true }
    ]
  },
  thursday: {
    name: "Thursday",
    title: "Upper Body Pull + Core",
    color: "bg-green-500",
    exercises: [
      { id: "thursday-warmup", name: "Warm-up: Arm swings, Jumping jacks", duration: "2 min", muscles: "Shoulders, Upper Back, Cardio", description: "Swing both arms forward and up, then back and down in big sweeping motions. Also do horizontal swings. Finish with jumping jacks.", easier: "Slower movements, smaller range", harder: "Increase speed and add dynamic stretches", isWarmup: true },
      {
        id: "thursday-dead-hangs",
        name: "Dead Hangs",
        sets: "3 × 15-30 sec",
        muscles: "Grip, Forearms, Lats, Shoulders",
        description: "Grab your pull-up bar with both hands. Hang with your arms fully straight and feet off the ground. Hold for as long as you can.",
        hasVariants: true,
        easier: {
          name: "Assisted Dead Hangs",
          sets: "3 × 15-20 sec",
          muscles: "Grip, Forearms, Lats",
          description: "Use a chair or step under your feet for partial support. Take some weight off your arms while still practicing the grip and hang position."
        },
        harder: {
          name: "Active Dead Hangs",
          sets: "3 × 20-30 sec",
          muscles: "Grip, Forearms, Lats, Shoulders, Upper Back",
          description: "While hanging, engage your shoulders by pulling your shoulder blades down and back (scapular depression). Hold this active position throughout the hang."
        }
      },
      {
        id: "thursday-seated-leg-lifts",
        name: "Seated Leg Lifts",
        sets: "3 × 8-10 reps",
        muscles: "Hip Flexors, Core, Triceps",
        description: "Sit on the floor with legs straight out. Place hands flat beside your hips. Press down through your hands and try to lift your legs off the ground.",
        hasVariants: true,
        easier: {
          name: "Seated Knee Lifts",
          sets: "3 × 10 reps",
          muscles: "Hip Flexors, Core",
          description: "Sit on the floor with knees bent. Press down through your hands and lift your bent knees toward your chest. This requires less strength than straight-leg lifts."
        },
        harder: {
          name: "Seated L-Sit Hold",
          sets: "3 × 8-12 sec",
          muscles: "Hip Flexors, Core, Triceps, Shoulders",
          description: "Lift your legs straight out in front of you and hold the position. Try to keep your legs parallel to the floor. This is a significant strength feat."
        }
      },
      {
        id: "thursday-negative-pullups",
        name: "Negative Pull-Ups",
        sets: "3 × 3-5 reps",
        muscles: "Lats, Biceps, Upper Back, Grip",
        description: "Jump or step up so your chin is above the bar. Slowly lower yourself down as controlled as possible, taking 3-5 seconds to reach the bottom.",
        hasVariants: true,
        easier: {
          name: "Assisted Negative Pull-Ups",
          sets: "3 × 5 reps",
          muscles: "Lats, Biceps, Upper Back",
          description: "Use a chair to step up to chin-over-bar position. Keep one foot lightly on the chair as you lower down for assistance. Use less and less help over time."
        },
        harder: {
          name: "Slow Negative Pull-Ups",
          sets: "3 × 3-4 reps",
          muscles: "Lats, Biceps, Upper Back, Grip, Core",
          description: "Take 8-10 seconds to lower from chin-over-bar to full hang. Add a 2-second pause halfway down. This dramatically increases time under tension."
        }
      },
      {
        id: "thursday-hollow-body",
        name: "Hollow Body Hold",
        sets: "3 × 10-15 sec",
        muscles: "Core, Hip Flexors",
        description: "Lie on your back. Lift your shoulders and legs slightly off the ground, arms reaching past your hips. Your body should make a banana shape.",
        hasVariants: true,
        easier: {
          name: "Bent Knee Hollow Hold",
          sets: "3 × 15-20 sec",
          muscles: "Core",
          description: "Same position but keep your knees bent with feet off the ground. This shortens the lever and makes the hold much easier while building core strength."
        },
        harder: {
          name: "Extended Hollow Hold",
          sets: "3 × 15-20 sec",
          muscles: "Core, Hip Flexors, Shoulders",
          description: "Perform the hollow body hold with arms extended overhead beside your ears. This lengthens the lever significantly, making your core work much harder."
        }
      },
      {
        id: "thursday-table-rows",
        name: "Table Rows",
        sets: "3 × 8-10",
        muscles: "Upper Back, Lats, Biceps, Core",
        description: "Lie underneath a sturdy table and grab the edge with both hands. Pull your chest up toward the table by squeezing your shoulder blades together.",
        hasVariants: true,
        easier: {
          name: "Bent Knee Table Rows",
          sets: "3 × 10-12",
          muscles: "Upper Back, Lats, Biceps",
          description: "Perform table rows with your knees bent and feet flat on the floor. This reduces the weight you're pulling and makes the exercise easier."
        },
        harder: {
          name: "Elevated Feet Table Rows",
          sets: "3 × 6-8",
          muscles: "Upper Back, Lats, Biceps, Core",
          description: "Place your feet on a chair or box while doing table rows. The elevation makes your body more horizontal, increasing the difficulty significantly."
        }
      },
      {
        id: "thursday-superman",
        name: "Superman Hold",
        sets: "3 × 10-15 sec",
        muscles: "Lower Back, Glutes, Upper Back",
        description: "Lie face down with arms stretched out in front of you. Lift your arms, chest, and legs off the floor at the same time.",
        hasVariants: true,
        easier: {
          name: "Alternating Superman",
          sets: "3 × 8 each side",
          muscles: "Lower Back, Glutes",
          description: "Lie face down. Lift just your right arm and left leg, hold briefly, then switch to left arm and right leg. This is easier than lifting everything at once."
        },
        harder: {
          name: "Superman Pulses",
          sets: "3 × 15 pulses",
          muscles: "Lower Back, Glutes, Upper Back",
          description: "Get into the superman position and hold. From there, pulse up and down in small movements for the rep count, never letting your limbs touch the ground."
        }
      },
      { id: "thursday-cooldown", name: "Cool-down: Lat stretch, Back stretch, Bicep stretch", duration: "2 min", muscles: "Lats, Back, Biceps", description: "Hold each stretch for 20-30 seconds. For lats: reach one arm overhead and lean to opposite side. For back: cat-cow stretches on all fours. For biceps: extend arm, palm up, gently pull fingers back.", easier: "Hold stretches for shorter time", harder: "Hold stretches for 30-45 seconds, go deeper", isCooldown: true }
    ]
  },
  friday: {
    name: "Friday",
    title: "Cardio + Full Body",
    color: "bg-red-500",
    exercises: [
      { id: "friday-warmup", name: "Warm-up: Jogging in place, Arm circles", duration: "2 min", muscles: "Full Body", description: "Do light jogging in place and arm circles to get your blood flowing and muscles warm.", easier: "Gentle walking and arm movements", harder: "Add dynamic stretches and high knees", isWarmup: true },
      {
        id: "friday-jumping-jacks",
        name: "Jumping Jacks",
        sets: "2 × 30 sec",
        muscles: "Cardio, Full Body, Shoulders",
        description: "Jump your feet out wide while raising your arms overhead, then jump back to the starting position.",
        hasVariants: true,
        easier: {
          name: "Step Jacks",
          sets: "2 × 30 sec",
          muscles: "Cardio, Shoulders",
          description: "Instead of jumping, step one foot out to the side while raising arms, then step back. Alternate sides. Low impact but still gets heart rate up."
        },
        harder: {
          name: "Star Jumps",
          sets: "2 × 30 sec",
          muscles: "Cardio, Full Body, Shoulders, Core",
          description: "From a squat position, explode upward spreading your arms and legs into a star shape at the peak. Land softly back into a squat."
        }
      },
      {
        id: "friday-squats",
        name: "Squats",
        sets: "2 × 10",
        muscles: "Quads, Glutes, Hamstrings, Core",
        description: "Stand with feet shoulder-width apart. Bend your knees and push your hips back. Go down until thighs are parallel to the floor.",
        hasVariants: true,
        easier: {
          name: "Half Squats",
          sets: "2 × 12",
          muscles: "Quads, Glutes",
          description: "Perform squats but only go down halfway - until your thighs are at about a 45-degree angle. This is easier on the knees and requires less mobility."
        },
        harder: {
          name: "Jump Squats",
          sets: "2 × 8",
          muscles: "Quads, Glutes, Hamstrings, Core, Cardio",
          description: "Perform a regular squat, then explode upward into a jump. Land softly and immediately go into the next squat. Keep movements controlled."
        }
      },
      {
        id: "friday-mountain-climbers",
        name: "Mountain Climbers",
        sets: "2 × 15 sec",
        muscles: "Cardio, Core, Shoulders",
        description: "Start in a push-up position. Bring one knee toward your chest, then quickly switch legs like you're running horizontally.",
        hasVariants: true,
        easier: {
          name: "Slow Mountain Climbers",
          sets: "2 × 20 sec",
          muscles: "Core, Shoulders",
          description: "Perform mountain climbers at a walking pace. Step one foot forward toward your hand, pause, then switch. Focus on controlled movement rather than speed."
        },
        harder: {
          name: "Cross-Body Mountain Climbers",
          sets: "2 × 20 sec",
          muscles: "Cardio, Core, Shoulders, Obliques",
          description: "Bring your knee toward the opposite elbow with each rep. This adds a rotational element that targets your obliques more intensely."
        }
      },
      {
        id: "friday-pushups",
        name: "Push-ups",
        sets: "2 × 8",
        muscles: "Chest, Shoulders, Triceps, Core",
        description: "Start in a plank position. Lower your chest toward the floor by bending your elbows, keeping your body straight. Push back up.",
        hasVariants: true,
        easier: {
          name: "Knee Push-ups",
          sets: "2 × 10",
          muscles: "Chest, Shoulders, Triceps",
          description: "Perform push-ups with your knees on the ground instead of your toes. Keep your body in a straight line from head to knees. Full range of motion."
        },
        harder: {
          name: "Diamond Push-ups",
          sets: "2 × 6",
          muscles: "Triceps, Chest, Shoulders, Core",
          description: "Place your hands close together under your chest, index fingers and thumbs touching to form a diamond shape. Perform push-ups with elbows close to your body."
        }
      },
      {
        id: "friday-burpees",
        name: "Burpees",
        sets: "2 × 5",
        muscles: "Full Body, Cardio",
        description: "From standing, squat down and put hands on the floor. Jump feet back into push-up position. Jump feet back toward hands. Stand up and jump.",
        hasVariants: true,
        easier: {
          name: "Step-Back Burpees",
          sets: "2 × 6",
          muscles: "Full Body",
          description: "Instead of jumping, step your feet back one at a time into plank, then step forward one at a time, and stand up. Skip the jump at the top. Low impact version."
        },
        harder: {
          name: "Burpees with Push-up",
          sets: "2 × 5",
          muscles: "Full Body, Cardio, Chest",
          description: "Add a full push-up when you're in the plank position before jumping your feet back up. Jump as high as you can at the top."
        }
      },
      { id: "friday-cooldown", name: "Cool-down: Full body stretch, Deep breathing", duration: "2 min", muscles: "Full Body", description: "Do gentle full body stretches: reach for toes, twist torso side to side, neck rolls, and finish with deep breathing. Inhale for 4 counts, hold for 4, exhale for 4.", easier: "Focus mainly on breathing", harder: "Add yoga poses like downward dog and child's pose", isCooldown: true }
    ]
  },
  saturday: {
    name: "Saturday",
    title: "Active Fun Day",
    color: "bg-purple-500",
    exercises: [
      { id: "saturday-fun", name: "Active Fun Activity", duration: "15-20 min", muscles: "Full Body", description: "Do something fun and active! YouTube workout, sports, games, or skip it if you need rest.", easier: "Take it as a rest day", harder: "Do 30-45 minutes of activity" }
    ]
  },
  sunday: {
    name: "Sunday",
    title: "Rest Day",
    color: "bg-gray-500",
    exercises: [
      { id: "sunday-rest", name: "Rest & Recovery", duration: "All day", muscles: "Full Body Recovery", description: "Full rest day. Relax, stretch if you want, and get ready for next week!", easier: "Complete rest", harder: "Do all the stretches below" },
      { id: "sunday-upper-stretches-header", name: "Upper Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "sunday-neck-rolls", name: "Neck Rolls", duration: "30 sec", muscles: "Neck", description: "Slowly roll your head in a circle, dropping your ear toward your shoulder, then chin to chest, then to the other shoulder. Do 5 circles each direction.", easier: "Smaller, slower circles", harder: "Hold each position for 5 seconds", isStretch: true },
      { id: "sunday-shoulder-circles", name: "Shoulder Circles", duration: "30 sec", muscles: "Shoulders, Upper Back", description: "Roll your shoulders forward in big circles 10 times, then backward 10 times. Keep your arms relaxed at your sides.", easier: "Smaller circles", harder: "Add arm raises with circles", isStretch: true },
      { id: "sunday-cross-body-shoulder", name: "Cross-Body Shoulder Stretch", duration: "30 sec each", muscles: "Shoulders, Upper Back", description: "Pull one arm across your chest with your other hand. Hold for 15-30 seconds, then switch arms.", easier: "Gentle pull, less range", harder: "Hold for 45 seconds each side", isStretch: true },
      { id: "sunday-tricep-stretch", name: "Tricep Stretch", duration: "30 sec each", muscles: "Triceps, Shoulders", description: "Reach one arm overhead, bend the elbow so your hand drops behind your head. Use your other hand to gently push the elbow back. Switch sides.", easier: "Don't push as deep", harder: "Hold for 45 seconds each side", isStretch: true },
      { id: "sunday-chest-doorway", name: "Chest Doorway Stretch", duration: "30 sec", muscles: "Chest, Front Shoulders", description: "Stand in a doorway with your forearm against the frame, elbow at shoulder height. Lean forward gently until you feel a stretch in your chest.", easier: "Less lean, arm lower", harder: "Try different arm angles (high, medium, low)", isStretch: true },
      { id: "sunday-core-stretches-header", name: "Core & Back Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "sunday-cat-cow", name: "Cat-Cow Stretch", duration: "1 min", muscles: "Spine, Core, Back", description: "On hands and knees, alternate between arching your back up (cat) and dropping your belly down while lifting your head (cow). Move slowly with your breath.", easier: "Smaller range of motion", harder: "Hold each position for 3-5 seconds", isStretch: true },
      { id: "sunday-childs-pose", name: "Child's Pose", duration: "30-60 sec", muscles: "Lower Back, Lats, Hips", description: "Kneel on the floor, sit back on your heels, then fold forward with arms extended in front of you. Rest your forehead on the floor and breathe deeply.", easier: "Put a pillow under your chest", harder: "Walk hands to each side for lat stretch", isStretch: true },
      { id: "sunday-spinal-twist", name: "Seated Spinal Twist", duration: "30 sec each", muscles: "Spine, Obliques, Hips", description: "Sit with legs extended. Bend one knee and cross it over the other leg. Twist your torso toward the bent knee, using your opposite elbow to push against it.", easier: "Keep bottom leg bent", harder: "Twist deeper, hold longer", isStretch: true },
      { id: "sunday-cobra", name: "Cobra Stretch", duration: "30 sec", muscles: "Abs, Hip Flexors, Chest", description: "Lie face down, place hands under shoulders. Press up to lift your chest while keeping hips on the ground. Look slightly upward.", easier: "Keep elbows bent (baby cobra)", harder: "Straighten arms fully", isStretch: true },
      { id: "sunday-lower-stretches-header", name: "Lower Body Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "sunday-quad-stretch", name: "Standing Quad Stretch", duration: "30 sec each", muscles: "Quadriceps", description: "Stand on one leg (hold something for balance). Grab your other ankle and pull your heel toward your butt. Keep knees close together.", easier: "Use a wall for balance", harder: "Pull heel closer, push hips forward", isStretch: true },
      { id: "sunday-hamstring-stretch", name: "Seated Hamstring Stretch", duration: "30 sec each", muscles: "Hamstrings, Lower Back", description: "Sit with one leg extended, other foot against inner thigh. Reach toward your toes on the extended leg, keeping your back straight.", easier: "Use a towel around your foot", harder: "Grab your foot and hold", isStretch: true },
      { id: "sunday-butterfly", name: "Butterfly Stretch", duration: "30-60 sec", muscles: "Inner Thighs, Hips", description: "Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor.", easier: "Feet further from body", harder: "Lean forward, feet closer to body", isStretch: true },
      { id: "sunday-figure-4", name: "Figure-4 Stretch", duration: "30 sec each", muscles: "Glutes, Hips, Piriformis", description: "Lie on your back. Cross one ankle over the opposite knee. Pull the uncrossed leg toward your chest until you feel a stretch in your hip/glute.", easier: "Keep foot on floor instead of pulling", harder: "Pull knee closer to chest", isStretch: true },
      { id: "sunday-calf-stretch", name: "Calf Stretch", duration: "30 sec each", muscles: "Calves, Achilles", description: "Stand facing a wall. Step one foot back, keeping it straight with heel on the ground. Lean into the wall until you feel a stretch in your back calf.", easier: "Smaller step back", harder: "Bend back knee slightly for deeper stretch", isStretch: true },
      { id: "sunday-hip-flexor", name: "Hip Flexor Lunge Stretch", duration: "30 sec each", muscles: "Hip Flexors, Quads", description: "Kneel on one knee with the other foot in front (lunge position). Push your hips forward while keeping your torso upright.", easier: "Use a pillow under your knee", harder: "Raise the arm on the kneeling side overhead", isStretch: true }
    ]
  }
};

export const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const REST_DAYS: DayName[] = ['wednesday', 'sunday'];

export function isRestDay(day: DayName): boolean {
  return REST_DAYS.includes(day);
}
