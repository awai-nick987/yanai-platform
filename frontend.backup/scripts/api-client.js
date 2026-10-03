// API クライアント
const API_BASE_URL = 'http://localhost:5001/api/v1';

class ApiClient {
  static async getSubmissions() {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }

  static async createSubmission(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author_name: data.name,
          author_age_group: data.age,
          content: data.content,
          theme: data.theme
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create submission');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  }

  static async getDashboard() {
    try {
      const submissions = await this.getSubmissions();
      return {
        totalCount: submissions.length,
        todayCount: submissions.filter(s => {
          const submitDate = new Date(s.created_at).toLocaleDateString();
          const today = new Date().toLocaleDateString();
          return submitDate === today;
        }).length,
        latestTime: submissions.length > 0 
          ? new Date(submissions[submissions.length - 1].created_at).toLocaleString('ja-JP')
          : 'なし'
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return { totalCount: 0, todayCount: 0, latestTime: 'なし' };
    }
  }
}
