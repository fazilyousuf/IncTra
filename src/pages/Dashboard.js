import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NavLink, useNavigate } from 'react-router-dom';

// Reusable Pie Chart Component
const PieChart = ({ data, width = 120, height = 120 }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '' });

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    // Pie generator
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc()
      .innerRadius(20)
      .outerRadius(Math.min(width, height) / 2);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(data.map(d => d.color));

    // Create arcs
    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');

    // Draw arcs
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .on('mouseover', (event, d) => {
        setTooltip({
          visible: true,
          content: `${d.data.label}: $${d.data.value}`,
          color: d.data.color
        });
      })
      .on('mouseout', () => setTooltip({ visible: false, content: '' }));

  }, [data, width, height]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={svgRef} />
      {tooltip.visible && (
        <div style={{
          position: 'absolute',
          top: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          color: tooltip.color,
          fontWeight: '500'
        }}>
          {tooltip.content}
        </div>
      )}
    </div>
  );
};


const CreditCardItem = ({ cardName, usedAmount, limit }) => {
    const navigate = useNavigate();
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
    const usagePercentage = ((usedAmount / limit) * 100).toFixed(1);
  
    const handleMouseMove = (e) => {
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 40
      });
    };
  
    return (
      <div 
        style={{
            background: 'white', 
            padding: '50px',
            borderRadius: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            margin: '20px 0',
            width: '100%',
            height:'50%',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onClick={() => navigate('/accounts')}
      >
        <div className="card-header">
          <h3 className="card-title">{cardName}</h3>
          <div className="amount-negative">-${usedAmount.toFixed(2)}</div>
        </div>
  
        <div 
          className="progress-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <div 
            className="progress-bar"
            style={{ width: `${usagePercentage}%` }}
          />
          
          {tooltipVisible && (
            <div 
              className="chart-tooltip"
              style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
            >
              ${usedAmount.toFixed(2)} / ${limit.toFixed(2)}
            </div>
          )}
        </div>
  
        <div className="percentage-text">{usagePercentage}% of limit used</div>
      </div>
    );
  };

  const BarChart = () => {
    const svgRef = useRef(null);
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  
    // Generate random data for last 7 days
    const generateData = () => {
      const days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          income: Math.floor(Math.random() * 1000),
          expense: Math.floor(Math.random() * 1000)
        };
      }).reverse();
      return days;
    };
  
    const [data] = useState(generateData());
  
    useEffect(() => {
      if (!svgRef.current) return;
  
      const width = 325;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
      // Clear previous
      d3.select(svgRef.current).selectAll('*').remove();
  
      // Create SVG
      const svg = d3.select(svgRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
  
      // Create scales
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([margin.left, width - margin.right])
        .padding(0.2);
  
      const yScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([height - margin.bottom, margin.top]);
  
      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale).ticks(10, '~s');
  
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis);
  
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);
  
      // Add grid lines
      svg.selectAll('yGrid')
        .data(yScale.ticks(10))
        .join('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 0.5);
  
      // Draw bars
      data.forEach(d => {
        // Income bars (green)
        svg.append('rect')
          .attr('x', xScale(d.date) + xScale.bandwidth()/4)
          .attr('y', yScale(d.income))
          .attr('width', xScale.bandwidth()/2)
          .attr('height', height - margin.bottom - yScale(d.income))
          .attr('fill', '#48bb78')
          .on('mouseover', (event) => {
            const [x, y] = d3.pointer(event);
            setTooltip({
              visible: true,
              content: `Income: $${d.income}`,
              x: x + margin.left,
              y: y - 20
            });
          })
          .on('mouseout', () => setTooltip({ visible: false, content: '' }));
  
        // Expense bars (red)
        svg.append('rect')
          .attr('x', xScale(d.date))
          .attr('y', yScale(d.expense))
          .attr('width', xScale.bandwidth()/2)
          .attr('height', height - margin.bottom - yScale(d.expense))
          .attr('fill', '#e53e3e')
          .on('mouseover', (event) => {
            const [x, y] = d3.pointer(event);
            setTooltip({
              visible: true,
              content: `Expense: $${d.expense}`,
              x: x + margin.left,
              y: y - 20
            });
          })
          .on('mouseout', () => setTooltip({ visible: false, content: '' }));
      });
  
    }, [data]);
  
    return (
      <div style={{ position: 'relative' }}>
        <h3 style={{ marginBottom: '10px', color: '#2d3748' }}>Last 7 Days</h3>
        <div ref={svgRef} />
        {tooltip.visible && (
          <div style={{
            position: 'absolute',
            left: tooltip.x + 'px',
            top: tooltip.y + 'px',
            backgroundColor: '#2d3748',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            pointerEvents: 'none',
            zIndex: 100
          }}>
            {tooltip.content}
          </div>
        )}
      </div>
    );
  };


const Dashboard = () => {
    const [thisMonthData] = useState([
        { label: 'Income', value: 6500, color: '#008000' },
        { label: 'Expenses', value: 4200, color: '#e53e3e' }
      ]);
    
    const [budgetData] = useState([
        { label: 'Allocated', value: 8000, color: '#008000' },
        { label: 'Used', value: 800, color: '#e53e3e' }
    ]);

    const navigate = useNavigate();

    const handleContainerClick = (path) => {
        navigate(path);
    };
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h3 style={{
            color: '#ffff',
            paddingLeft: '30px'
          }}>Dashboard</h3>
        </div>
  
        <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '15px',
        padding: '20px',
        marginTop: '60px' 
      }}>
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          minHeight: '180px'
        }} onClick={() => handleContainerClick('/accounts')}
        >
          <h3 style={{ fontSize: '1.3rem', margin: '0 0 12px 0' }}>Summary</h3>
          <div style={{ fontSize: '1.5rem', lineHeight: '1',display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Balance:</span> <span style={{ color: '#008000' }}>$13,717.71</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Credit cards:</span>
              <span style={{ color: '#e53e3e' }}>-$249.00</span>
            </div>
            <div style={{
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '12px',
              paddingTop: '15px',
              borderTop: '1px solid #eee',
              textAlign:'right'
            }}>
              <span style={{ color: '#008000' }}>$13,717.71</span>
            </div>
          </div>
        </div>

        <div style={{
        background:'white' ,
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: '180px',
        }} onClick={() => handleContainerClick('/transactions')}>
        <h3 style={{ fontSize: '1.3rem', margin: '0 0 12px 0', textAlign: 'right'}}>This Month</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '120px', height: '120px' }}>
            <PieChart data={thisMonthData} />
            </div>
            <div style={{ flex: 1, fontSize: '1.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#008000' }}>Income:</span>
                <span style={{ color: '#008000' }}>${thisMonthData[0].value}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#e53e3e' }}>Expenses:</span>
                <span style={{ color: '#e53e3e' }}>${thisMonthData[1].value}</span>
            </div>
            </div>
        </div>
        </div>

        <div style={{
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: '180px'
        }} onClick={() => handleContainerClick('/transactions')}>
        <h3 style={{ fontSize: '1.3rem', margin: '0 0 12px 0', textAlign:'right'}}>Budget</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '120px', height: '120px' }}>
            <PieChart data={budgetData} />
            </div>
            <div style={{ flex: 1, fontSize: '1.3rem'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#008000' }}>Allocated:</span>
                <span style={{ color: '#008000' }}>${budgetData[0].value}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#e53e3e' }}>Used:</span>
                <span style={{ color: '#e53e3e' }}>${budgetData[1].value}</span>
            </div>
            </div>
        </div>
        </div>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          minHeight: '400px'
        
        }}>
          <BarChart />
        </div>
        <CreditCardItem 
          cardName="Credit Card" 
          usedAmount={155} 
          limit={1000} 
        />
        

    </div>
    </div>
    );
  };

  export default Dashboard;