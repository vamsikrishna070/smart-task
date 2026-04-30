import { Task } from '../models/Task.js';

export async function getDashboardInsights(req, res) {
  try {
    const userId = req.userId;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const [allTasks, completedTodayTasks, activityTodayTasks] = await Promise.all([
      Task.find({ userId }),
      Task.find({
        userId,
        status: 'Completed',
        updatedAt: { $gte: startOfToday, $lt: endOfToday },
      }),
      Task.find({
        userId,
        updatedAt: { $gte: startOfToday, $lt: endOfToday },
      }),
    ]);

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = allTasks.filter((t) => t.status === 'Pending').length;
    const inProgressTasks = allTasks.filter((t) => t.status === 'In Progress').length;
    const completedToday = completedTodayTasks.length;
    const dailyActivityCount = activityTodayTasks.length;

    const overdueTasks = allTasks.filter(
      (t) => t.status !== 'Completed' && t.deadline && new Date(t.deadline) < now
    ).length;

    // Category distribution
    const categoryMap = {};
    allTasks.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
    });

    const mostActiveCategory =
      Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completedToday,
      dailyActivityCount,
      mostActiveCategory,
      overdueTasks,
      completionRate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch insights', error: error.message });
  }
}

export async function getCategoryDistribution(req, res) {
  try {
    const userId = req.userId;
    const tasks = await Task.find({ userId });

    const categoryMap = {};
    tasks.forEach((t) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { count: 0, completed: 0 };
      }
      categoryMap[t.category].count++;
      if (t.status === 'Completed') {
        categoryMap[t.category].completed++;
      }
    });

    const categories = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      completed: data.completed,
    }));

    res.json({ categories });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
}
