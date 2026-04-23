import { useMemo } from 'react';
import './ActivityHeatmap.css';

export default function ActivityHeatmap({ data = [] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate 365 days of data and overlay user data
  const fullYearData = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // Create map of user data for quick lookup
    const dataMap = {};
    data.forEach(item => {
      dataMap[item.date] = item.count;
    });

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: dataMap[dateStr] || 0
      });
    }
    return result;
  }, [data]);

  // Group logic (simplified for visualization)
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < fullYearData.length; i += 7) {
      cols.push(fullYearData.slice(i, i + 7));
    }
    return cols;
  }, [fullYearData]);

  // Calculate dynamic month labels and their positions
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    
    columns.forEach((col, i) => {
      const firstDay = new Date(col[0].date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({ name: months[month], index: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [columns, months]);

  const getColorClass = (count) => {
    if (count === 0) return 'level-0';
    if (count === 1) return 'level-1';
    if (count === 2) return 'level-2';
    if (count === 3) return 'level-3';
    return 'level-4';
  };

  return (
    <div className="heatmap-container glass-card">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Project Activity</h3>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-cells">
            <div className="cell level-0" />
            <div className="cell level-1" />
            <div className="cell level-2" />
            <div className="cell level-3" />
            <div className="cell level-4" />
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="heatmap-wrapper">
        <div className="days-labels">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        <div className="heatmap-grid-scroll">
          <div className="heatmap-grid">
            {columns.map((col, i) => (
              <div key={i} className="heatmap-column">
                {col.map((day, j) => (
                  <div 
                    key={`${i}-${j}`} 
                    className={`heatmap-cell ${getColorClass(day.count)}`} 
                    title={`${day.count} activities on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="months-labels" style={{ position: 'relative' }}>
            {monthLabels.map((m, i) => (
              <span 
                key={i} 
                className="month-label" 
                style={{ 
                  position: 'absolute', 
                  left: `${m.index * 14}px`, // 10px cell + 4px gap
                  fontSize: '0.7rem' 
                }}
              >
                {m.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
