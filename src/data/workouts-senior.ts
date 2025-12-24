import type { WorkoutData } from '../types';

export const seniorWorkoutData: WorkoutData = {
  monday: {
    name: "Monday",
    title: "Gentle Mobility",
    color: "bg-blue-500",
    exercises: [
      { id: "senior-monday-warmup", name: "Warm-up: Seated Marching", duration: "2 min", muscles: "Legs, Cardio", description: "Sit in a sturdy chair. March your feet up and down, lifting knees gently. Swing your arms naturally. Start slow and gradually increase pace.", easier: "Smaller, slower movements", harder: "Lift knees higher, add arm reaches", isWarmup: true },
      {
        id: "senior-monday-neck-rolls",
        name: "Gentle Neck Rolls",
        sets: "2 × 5 each direction",
        muscles: "Neck, Upper Back",
        description: "Sit or stand tall. Slowly drop your chin to chest, then roll your head to one shoulder, back, other shoulder, and return. Move slowly and gently.",
        hasVariants: true,
        easier: {
          name: "Neck Tilts",
          sets: "2 × 5 each side",
          muscles: "Neck",
          description: "Simply tilt your head side to side, ear toward shoulder. Hold each side for 5 seconds. No rolling motion needed."
        },
        harder: {
          name: "Neck Rolls with Hold",
          sets: "2 × 5 each direction",
          muscles: "Neck, Upper Back",
          description: "Perform neck rolls but pause for 3 seconds in each position: front, side, back, other side."
        }
      },
      {
        id: "senior-monday-shoulder-shrugs",
        name: "Shoulder Shrugs",
        sets: "2 × 10",
        muscles: "Shoulders, Upper Back",
        description: "Sit or stand with arms relaxed at sides. Raise both shoulders up toward your ears, hold for 2 seconds, then release. Breathe naturally.",
        hasVariants: true,
        easier: {
          name: "Gentle Shoulder Lifts",
          sets: "2 × 8",
          muscles: "Shoulders",
          description: "Lift shoulders only halfway up, focusing on relaxation. Hold for 1 second and release slowly."
        },
        harder: {
          name: "Shoulder Rolls",
          sets: "2 × 10 each direction",
          muscles: "Shoulders, Upper Back",
          description: "Roll shoulders forward in circles, then backward. Make the circles as big as comfortable."
        }
      },
      {
        id: "senior-monday-seated-twist",
        name: "Seated Spinal Twist",
        sets: "2 × 5 each side",
        muscles: "Spine, Core, Back",
        description: "Sit tall in a chair. Place right hand on left knee. Gently twist your torso to the left, looking over your left shoulder. Hold for 10 seconds, then switch sides.",
        hasVariants: true,
        easier: {
          name: "Gentle Seated Turn",
          sets: "2 × 5 each side",
          muscles: "Spine",
          description: "Turn your upper body slightly to each side without using your hands. Move within a comfortable range only."
        },
        harder: {
          name: "Deep Seated Twist",
          sets: "2 × 5 each side",
          muscles: "Spine, Core, Obliques",
          description: "Twist further and hold for 15-20 seconds. Use the chair arm to deepen the stretch if comfortable."
        }
      },
      {
        id: "senior-monday-ankle-circles",
        name: "Ankle Circles",
        sets: "2 × 10 each foot",
        muscles: "Ankles, Calves",
        description: "Sit in a chair and lift one foot off the ground. Rotate your ankle in circles, 10 times one direction, then 10 times the other. Switch feet.",
        hasVariants: true,
        easier: {
          name: "Ankle Points",
          sets: "2 × 10 each foot",
          muscles: "Ankles",
          description: "Simply point your toes down, then flex them up toward you. Repeat 10 times per foot."
        },
        harder: {
          name: "Ankle Alphabet",
          sets: "1 × each foot",
          muscles: "Ankles, Calves",
          description: "Trace the letters of the alphabet with your toes. This provides a complete range of motion workout for your ankles."
        }
      },
      {
        id: "senior-monday-wrist-rotations",
        name: "Wrist Rotations",
        sets: "2 × 10 each direction",
        muscles: "Wrists, Forearms",
        description: "Extend your arms in front. Make fists and rotate your wrists in circles. Do 10 circles one way, then 10 the other way.",
        hasVariants: true,
        easier: {
          name: "Wrist Flexes",
          sets: "2 × 10",
          muscles: "Wrists",
          description: "Extend arms forward. Simply bend wrists up and down (like waving goodbye). Hold each position briefly."
        },
        harder: {
          name: "Wrist Circles with Finger Spread",
          sets: "2 × 10 each direction",
          muscles: "Wrists, Fingers, Forearms",
          description: "Spread fingers wide while making wrist circles. This adds a stretch to your fingers and hands."
        }
      },
      { id: "senior-monday-cooldown", name: "Cool-down: Deep Breathing", duration: "2 min", muscles: "Relaxation", description: "Sit comfortably. Breathe in slowly through your nose for 4 counts, hold for 2 counts, exhale through your mouth for 6 counts. Repeat 5-10 times.", easier: "Shorter breath counts", harder: "Extend exhale to 8 counts", isCooldown: true }
    ]
  },
  tuesday: {
    name: "Tuesday",
    title: "Balance & Strength",
    color: "bg-orange-500",
    exercises: [
      { id: "senior-tuesday-warmup", name: "Warm-up: Standing March", duration: "2 min", muscles: "Legs, Cardio", description: "Stand behind a sturdy chair for support. March in place, lifting knees gently. Swing arms naturally. If needed, hold the chair with one hand.", easier: "March while seated", harder: "March without holding chair", isWarmup: true },
      {
        id: "senior-tuesday-chair-squats",
        name: "Chair-Assisted Squats",
        sets: "2 × 8",
        muscles: "Quads, Glutes, Balance",
        description: "Stand in front of a sturdy chair. Slowly lower yourself as if sitting down, lightly touch the seat, then stand back up. Use the chair arms for support if needed.",
        hasVariants: true,
        easier: {
          name: "Sit-to-Stand",
          sets: "2 × 8",
          muscles: "Quads, Glutes",
          description: "Actually sit down in the chair, pause, then stand back up. Use chair arms to help push up if needed."
        },
        harder: {
          name: "Slow Chair Squats",
          sets: "2 × 6",
          muscles: "Quads, Glutes, Core",
          description: "Take 4 seconds to lower, hover above seat for 2 seconds, then take 4 seconds to stand. No hands on chair."
        }
      },
      {
        id: "senior-tuesday-heel-toe-walk",
        name: "Heel-to-Toe Walk",
        sets: "2 × 10 steps",
        muscles: "Balance, Ankles, Calves",
        description: "Walk in a straight line, placing the heel of one foot directly in front of the toes of the other foot. Use a wall for support if needed.",
        hasVariants: true,
        easier: {
          name: "Sideways Steps",
          sets: "2 × 10 steps each way",
          muscles: "Balance, Hips",
          description: "Step sideways along a wall, keeping one hand on the wall for support. Step together, step together."
        },
        harder: {
          name: "Heel-to-Toe Walk Arms Out",
          sets: "2 × 10 steps",
          muscles: "Balance, Core",
          description: "Walk heel-to-toe with arms extended out to the sides like airplane wings. No wall support."
        }
      },
      {
        id: "senior-tuesday-single-leg-stand",
        name: "Single Leg Stand",
        sets: "3 × 10 sec each leg",
        muscles: "Balance, Ankles, Core",
        description: "Stand behind a chair, holding lightly for support. Lift one foot slightly off the ground. Hold for 10 seconds, then switch legs.",
        hasVariants: true,
        easier: {
          name: "Toe Lift Balance",
          sets: "3 × 10 sec each leg",
          muscles: "Balance",
          description: "Keep your toe on the ground but lift the heel. Hold the chair firmly for support. This is a gentler balance challenge."
        },
        harder: {
          name: "Single Leg Stand - Fingertips Only",
          sets: "3 × 15 sec each leg",
          muscles: "Balance, Core, Ankles",
          description: "Use only fingertips on the chair for minimal support. Try to lift fingers off occasionally."
        }
      },
      {
        id: "senior-tuesday-wall-pushups",
        name: "Wall Push-ups",
        sets: "2 × 8",
        muscles: "Chest, Shoulders, Arms",
        description: "Stand arm's length from a wall. Place hands on wall at shoulder height. Lean in by bending elbows, then push back. Keep body straight.",
        hasVariants: true,
        easier: {
          name: "Close Wall Push-ups",
          sets: "2 × 10",
          muscles: "Chest, Shoulders",
          description: "Stand just 6 inches from the wall. Very small range of motion makes this much easier while building strength."
        },
        harder: {
          name: "Counter Push-ups",
          sets: "2 × 6",
          muscles: "Chest, Shoulders, Arms, Core",
          description: "Use a sturdy kitchen counter instead of a wall. The lower angle increases difficulty."
        }
      },
      { id: "senior-tuesday-cooldown", name: "Cool-down: Calf & Leg Stretches", duration: "2 min", muscles: "Calves, Legs", description: "Hold chair for balance. Step one foot back, press heel down for calf stretch (20 sec each). Then gently swing each leg forward and back to loosen hips.", easier: "Smaller movements", harder: "Hold stretches longer", isCooldown: true }
    ]
  },
  wednesday: {
    name: "Wednesday",
    title: "Rest & Gentle Stretch",
    color: "bg-gray-500",
    exercises: [
      { id: "senior-wednesday-rest", name: "Rest & Recovery", duration: "All day", muscles: "Full Body Recovery", description: "Take it easy today! Light stretching below if you feel like moving. Listen to your body - rest is important for getting stronger.", easier: "Complete rest", harder: "Do all stretches below" },
      { id: "senior-wednesday-stretches-header", name: "Optional Gentle Stretches", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "senior-wednesday-neck", name: "Neck Side Stretch", duration: "30 sec each", muscles: "Neck", description: "Sit tall. Tilt ear toward shoulder, hold 30 seconds. Use hand to gently increase stretch if comfortable. Switch sides.", easier: "Shorter hold", harder: "Hold 45 seconds", isStretch: true },
      { id: "senior-wednesday-shoulder", name: "Shoulder Stretch", duration: "30 sec each", muscles: "Shoulders", description: "Bring one arm across your chest. Use the other hand to gently hold it. Feel the stretch in your shoulder. Switch sides.", easier: "Less pressure", harder: "Hold longer", isStretch: true },
      { id: "senior-wednesday-chest", name: "Seated Chest Opener", duration: "30 sec", muscles: "Chest, Shoulders", description: "Sit at the edge of a chair. Clasp hands behind your back, squeeze shoulder blades together, and lift hands slightly. Breathe deeply.", easier: "Don't lift hands", harder: "Hold for 45 seconds", isStretch: true },
      { id: "senior-wednesday-cat-cow", name: "Seated Cat-Cow", duration: "1 min", muscles: "Spine, Back", description: "Sit tall in a chair. Arch your back and look up (cow). Then round your back and look down (cat). Move slowly with your breath.", easier: "Smaller range", harder: "Hold each position 3 seconds", isStretch: true },
      { id: "senior-wednesday-hip", name: "Seated Figure-4 Stretch", duration: "30 sec each", muscles: "Hips, Glutes", description: "Sit in a chair. Cross one ankle over the opposite knee. Gently lean forward until you feel a stretch in your hip. Switch sides.", easier: "Don't lean forward", harder: "Lean further forward", isStretch: true },
      { id: "senior-wednesday-ankle", name: "Ankle Stretches", duration: "30 sec each", muscles: "Ankles, Feet", description: "Sit and extend one leg. Point toes away, then flex toward you. Rotate ankles in circles. Switch feet.", easier: "Smaller movements", harder: "Larger circles", isStretch: true }
    ]
  },
  thursday: {
    name: "Thursday",
    title: "Upper Body Mobility",
    color: "bg-green-500",
    exercises: [
      { id: "senior-thursday-warmup", name: "Warm-up: Arm Swings", duration: "2 min", muscles: "Shoulders, Arms", description: "Stand or sit. Swing arms gently forward and back, then side to side across your body. Keep movements controlled and comfortable.", easier: "Smaller swings", harder: "Larger swings", isWarmup: true },
      {
        id: "senior-thursday-overhead-reach",
        name: "Overhead Reaches",
        sets: "2 × 8 each arm",
        muscles: "Shoulders, Back, Core",
        description: "Sit or stand tall. Reach one arm up toward the ceiling, stretching through your side. Hold for 2 seconds, lower, and switch arms.",
        hasVariants: true,
        easier: {
          name: "Front Reaches",
          sets: "2 × 8 each arm",
          muscles: "Shoulders",
          description: "Reach forward at shoulder height instead of overhead. This is easier on the shoulders."
        },
        harder: {
          name: "Overhead Reach with Side Bend",
          sets: "2 × 6 each arm",
          muscles: "Shoulders, Obliques, Back",
          description: "Reach up and gently lean to the opposite side for a deeper stretch through your side body."
        }
      },
      {
        id: "senior-thursday-chest-opener",
        name: "Chest Opener Stretch",
        sets: "3 × 15 sec",
        muscles: "Chest, Front Shoulders",
        description: "Sit or stand. Clasp hands behind your back. Gently squeeze shoulder blades together and lift clasped hands slightly. Feel the stretch in your chest.",
        hasVariants: true,
        easier: {
          name: "Doorway Chest Stretch",
          sets: "3 × 15 sec",
          muscles: "Chest",
          description: "Stand in a doorway with forearm on the frame. Step forward gently to stretch your chest."
        },
        harder: {
          name: "Deep Chest Opener",
          sets: "3 × 20 sec",
          muscles: "Chest, Front Shoulders",
          description: "Lift clasped hands higher while squeezing shoulder blades. Hold longer for deeper stretch."
        }
      },
      {
        id: "senior-thursday-shoulder-rolls",
        name: "Shoulder Circles",
        sets: "2 × 10 each direction",
        muscles: "Shoulders, Upper Back",
        description: "Sit or stand with good posture. Roll shoulders forward in big, slow circles. Then reverse direction. Keep breathing naturally.",
        hasVariants: true,
        easier: {
          name: "Shoulder Shrugs",
          sets: "2 × 10",
          muscles: "Shoulders",
          description: "Simply lift shoulders up toward ears, hold 2 seconds, then release. No circular motion needed."
        },
        harder: {
          name: "Arm Circles",
          sets: "2 × 10 each direction",
          muscles: "Shoulders, Arms",
          description: "Extend arms out to sides and make small circles, gradually getting bigger. Then reverse."
        }
      },
      {
        id: "senior-thursday-bicep-curls",
        name: "Arm Curls (No Weight)",
        sets: "2 × 10",
        muscles: "Biceps, Forearms",
        description: "Sit or stand with arms at sides, palms facing forward. Bend elbows to bring hands toward shoulders, squeezing the muscles. Lower slowly.",
        hasVariants: true,
        easier: {
          name: "Gentle Arm Bends",
          sets: "2 × 8",
          muscles: "Biceps",
          description: "Perform with smaller range of motion. Focus on the squeezing feeling in your arms."
        },
        harder: {
          name: "Slow Arm Curls",
          sets: "2 × 8",
          muscles: "Biceps, Forearms",
          description: "Take 3 seconds to curl up and 3 seconds to lower. Make fists to increase muscle engagement."
        }
      },
      { id: "senior-thursday-cooldown", name: "Cool-down: Neck & Shoulder Stretches", duration: "2 min", muscles: "Neck, Shoulders", description: "Gently tilt head side to side (20 sec each). Pull one arm across chest (20 sec each). Roll shoulders slowly. Breathe deeply throughout.", easier: "Shorter holds", harder: "Longer holds", isCooldown: true }
    ]
  },
  friday: {
    name: "Friday",
    title: "Light Cardio & Core",
    color: "bg-red-500",
    exercises: [
      { id: "senior-friday-warmup", name: "Warm-up: Marching in Place", duration: "2 min", muscles: "Legs, Cardio", description: "Stand behind a chair for support if needed. March in place, lifting knees comfortably. Swing arms naturally. Start slow, gradually increase pace.", easier: "Seated marching", harder: "March without support", isWarmup: true },
      {
        id: "senior-friday-seated-leg-lifts",
        name: "Seated Leg Lifts",
        sets: "2 × 8 each leg",
        muscles: "Quads, Hip Flexors, Core",
        description: "Sit in a chair with back straight. Slowly lift one leg straight out in front of you, hold for 2 seconds, then lower. Switch legs.",
        hasVariants: true,
        easier: {
          name: "Seated Knee Lifts",
          sets: "2 × 8 each leg",
          muscles: "Hip Flexors",
          description: "Lift your knee toward your chest instead of straightening the leg. Easier on the quads."
        },
        harder: {
          name: "Seated Leg Lift with Hold",
          sets: "2 × 6 each leg",
          muscles: "Quads, Hip Flexors, Core",
          description: "Hold the lifted position for 5 seconds before lowering. Adds significant core challenge."
        }
      },
      {
        id: "senior-friday-side-bends",
        name: "Standing Side Bends",
        sets: "2 × 8 each side",
        muscles: "Obliques, Core, Spine",
        description: "Stand with feet shoulder-width apart, holding a chair for support. Slide one hand down your thigh, bending at the waist. Return to center, switch sides.",
        hasVariants: true,
        easier: {
          name: "Seated Side Bends",
          sets: "2 × 8 each side",
          muscles: "Obliques",
          description: "Perform while sitting in a chair. Reach one arm overhead and lean gently to the opposite side."
        },
        harder: {
          name: "Side Bends with Arm Reach",
          sets: "2 × 8 each side",
          muscles: "Obliques, Shoulders",
          description: "Reach the opposite arm overhead as you bend, creating a longer stretch through the side body."
        }
      },
      {
        id: "senior-friday-gentle-twists",
        name: "Standing Gentle Twists",
        sets: "2 × 8 each side",
        muscles: "Core, Spine, Obliques",
        description: "Stand with feet shoulder-width apart. Let arms hang relaxed. Gently rotate your torso side to side, letting arms swing naturally.",
        hasVariants: true,
        easier: {
          name: "Seated Twists",
          sets: "2 × 8 each side",
          muscles: "Core, Spine",
          description: "Sit in a chair and gently twist side to side, keeping hips facing forward."
        },
        harder: {
          name: "Twist and Hold",
          sets: "2 × 6 each side",
          muscles: "Core, Obliques",
          description: "Twist to one side and hold for 3 seconds before twisting to the other side."
        }
      },
      {
        id: "senior-friday-step-touches",
        name: "Step Touches",
        sets: "2 × 30 sec",
        muscles: "Cardio, Legs, Balance",
        description: "Step to the right with right foot, bring left foot to meet it. Then step left, bring right foot to meet. Add arm movements for more activity.",
        hasVariants: true,
        easier: {
          name: "Seated Toe Taps",
          sets: "2 × 30 sec",
          muscles: "Legs",
          description: "Sit in a chair. Alternate tapping toes out to each side. Add arm movements if comfortable."
        },
        harder: {
          name: "Step Touch with Arm Raises",
          sets: "2 × 30 sec",
          muscles: "Cardio, Legs, Shoulders",
          description: "As you step to each side, raise both arms out to shoulder height, then lower as feet come together."
        }
      },
      { id: "senior-friday-cooldown", name: "Cool-down: Hip & Back Stretches", duration: "2 min", muscles: "Hips, Back", description: "Sit in a chair. Cross one ankle over opposite knee for hip stretch (30 sec each). Then gently lean forward with a flat back to stretch lower back.", easier: "Shorter holds", harder: "Longer holds", isCooldown: true }
    ]
  },
  saturday: {
    name: "Saturday",
    title: "Active Fun Day",
    color: "bg-purple-500",
    exercises: [
      { id: "senior-saturday-fun", name: "Enjoyable Movement", duration: "15-20 min", muscles: "Full Body", description: "Do something you enjoy! Ideas: gentle walking, gardening, dancing to music, playing with grandchildren, light swimming, or tai chi. Move at your own pace.", easier: "5-10 minutes of any movement", harder: "30+ minutes of activity" }
    ]
  },
  sunday: {
    name: "Sunday",
    title: "Rest & Recovery",
    color: "bg-gray-500",
    exercises: [
      { id: "senior-sunday-rest", name: "Full Rest Day", duration: "All day", muscles: "Recovery", description: "Complete rest day. Relax and let your body recover. Light stretching is fine if you feel like it, but rest is the priority.", easier: "Complete rest", harder: "Do gentle stretches" },
      { id: "senior-sunday-optional-header", name: "Optional Light Activity", category: true, muscles: "", description: "", easier: "", harder: "" },
      { id: "senior-sunday-breathing", name: "Deep Breathing", duration: "5 min", muscles: "Relaxation", description: "Sit comfortably. Breathe in through nose for 4 counts, hold for 2, exhale through mouth for 6 counts. Repeat. Great for relaxation and stress relief.", easier: "Shorter counts", harder: "Longer exhales", isStretch: true },
      { id: "senior-sunday-gentle-stretch", name: "Full Body Gentle Stretch", duration: "5 min", muscles: "Full Body", description: "If you feel like moving: gentle neck rolls, shoulder shrugs, wrist circles, ankle circles, and seated twists. All very gentle, no strain.", easier: "Pick 2-3 stretches only", harder: "Hold each stretch longer", isStretch: true }
    ]
  }
};

export const seniorDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
