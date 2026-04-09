// Wedding Planning Checklist Database
export const weddingChecklist = {
  '12-months': {
    title: '12 Months Before',
    icon: '📅',
    tasks: [
      { id: '12-1', task: 'Set wedding date', description: 'Consider weather, venue availability, and guest schedules' },
      { id: '12-2', task: 'Set overall budget', description: 'Determine total budget and allocate to categories' },
      { id: '12-3', task: 'Create guest list', description: 'Start compiling names from both families' },
      { id: '12-4', task: 'Book venue/marquee', description: 'Visit venues and secure your top choice with deposit' },
      { id: '12-5', task: 'Book photographer', description: 'Research and book top photographers early' },
      { id: '12-6', task: 'Choose wedding planner', description: 'Optional but helpful for large weddings' },
      { id: '12-7', task: 'Start outfit hunting', description: 'Begin browsing for bridal and groom outfits' }
    ]
  },
  '9-months': {
    title: '9 Months Before',
    icon: '🎯',
    tasks: [
      { id: '9-1', task: 'Book caterer', description: 'Taste test and finalize menu packages' },
      { id: '9-2', task: 'Book decorator', description: 'Discuss themes, colors, and concepts' },
      { id: '9-3', task: 'Shop for bridal outfit', description: 'Order custom bridal lehnga/dress' },
      { id: '9-4', task: 'Book makeup artist', description: 'Schedule trials and book for all events' },
      { id: '9-5', task: 'Finalize guest list', description: 'Get final numbers from both families' },
      { id: '9-6', task: 'Book entertainment', description: 'DJ, live band, or dhol players' }
    ]
  },
  '6-months': {
    title: '6 Months Before',
    icon: '✨',
    tasks: [
      { id: '6-1', task: 'Order wedding invitations', description: 'Design and print invitations' },
      { id: '6-2', task: 'Book honeymoon', description: 'Research destinations and book travel' },
      { id: '6-3', task: 'Finalize decor theme', description: 'Confirm colors, flowers, and staging' },
      { id: '6-4', task: 'Shop for groom outfit', description: 'Order sherwani and accessories' },
      { id: '6-5', task: 'Plan mehndi event', description: 'Finalize mehndi theme and entertainment' },
      { id: '6-6', task: 'Arrange transport', description: 'Book bridal car and guest transport' }
    ]
  },
  '3-months': {
    title: '3 Months Before',
    icon: '💒',
    tasks: [
      { id: '3-1', task: 'Send invitations', description: 'Distribute or mail all wedding cards' },
      { id: '3-2', task: 'Final menu tasting', description: 'Confirm all dishes with caterer' },
      { id: '3-3', task: 'Bridal outfit fittings', description: 'Schedule alterations if needed' },
      { id: '3-4', task: 'Book mehndi artist', description: 'Confirm designs and pricing' },
      { id: '3-5', task: 'Plan bachelor/bachelorette', description: 'Organize pre-wedding celebrations' },
      { id: '3-6', task: 'Order wedding favors', description: 'Mithai boxes, gifts for guests' },
      { id: '3-7', task: 'Confirm all vendors', description: 'Reconfirm dates with every vendor' }
    ]
  },
  '1-month': {
    title: '1 Month Before',
    icon: '🌟',
    tasks: [
      { id: '1-1', task: 'Final guest count', description: 'Confirm RSVPs and inform venue' },
      { id: '1-2', task: 'Final payments', description: 'Clear all vendor payments' },
      { id: '1-3', task: 'Marriage license', description: 'Complete nikah paperwork' },
      { id: '1-4', task: 'Seating arrangement', description: 'Plan stage and family seating' },
      { id: '1-5', task: 'Makeup trial', description: 'Final trial for bridal look' },
      { id: '1-6', task: 'Break in wedding shoes', description: 'Wear shoes at home to soften' },
      { id: '1-7', task: 'Create day-of timeline', description: 'Schedule for each event' }
    ]
  },
  '1-week': {
    title: '1 Week Before',
    icon: '🎊',
    tasks: [
      { id: 'w-1', task: 'Confirm all vendors', description: 'Final confirmation calls' },
      { id: 'w-2', task: 'Pack honeymoon bags', description: 'Prepare travel essentials' },
      { id: 'w-3', task: 'Prepare wedding outfit', description: 'Iron, steam, and organize' },
      { id: 'w-4', task: 'Bridal skincare routine', description: 'Final facials and treatments' },
      { id: 'w-5', task: 'Assign day-of responsibilities', description: 'Delegate tasks to family' },
      { id: 'w-6', task: 'Prepare emergency kit', description: 'Safety pins, tissues, medicine' }
    ]
  },
  'day-before': {
    title: 'Day Before',
    icon: '💫',
    tasks: [
      { id: 'd-1', task: 'Venue walkthrough', description: 'Visit and inspect the venue' },
      { id: 'd-2', task: 'Rest and relax', description: 'Get good sleep, stay hydrated' },
      { id: 'd-3', task: 'Prepare outfit for pickup', description: 'Have everything ready' },
      { id: 'd-4', task: 'Charge all devices', description: 'Phones, cameras ready' },
      { id: 'd-5', task: 'Mehndi application', description: 'Apply bridal mehndi' }
    ]
  }
};

// Get all checklist items
export const getAllChecklistItems = () => {
  return Object.entries(weddingChecklist).map(([key, value]) => ({
    period: key,
    ...value
  }));
};

// Get total task count
export const getTotalTaskCount = () => {
  return Object.values(weddingChecklist).reduce((total, period) => 
    total + period.tasks.length, 0
  );
};
