export function TipsCard() {
  return (
    <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-3 text-yellow-400">💡 Important Tips</h3>
      <ul className="space-y-2 text-theme-text-secondary">
        <li>
          • <strong>Form first!</strong> Do exercises correctly before adding more reps.
        </li>
        <li>
          • <strong>Listen to your body.</strong> Sore is okay, pain is not.
        </li>
        <li>
          • <strong>Drink water</strong> before, during, and after workouts.
        </li>
        <li>
          • <strong>Sleep matters!</strong> Aim for 10-12 hours — your muscles grow while you sleep!
        </li>
      </ul>
    </div>
  );
}
