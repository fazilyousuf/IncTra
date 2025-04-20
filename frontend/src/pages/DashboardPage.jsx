import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NavLink, useNavigate } from 'react-router-dom';

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


const BarChart = () => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

    // Generate random data for last 7 days
    const generateData = () => {
      const days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          income: Math.floor(Math.random() * 1000),
          expense: Math.floor(Math.random() * 1000)
        };
      }).reverse();
      return days;
    };

    const [data] = useState(generateData());

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const containerWidth = containerRef.current.clientWidth;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      // Clear previous
      d3.select(svgRef.current).selectAll('*').remove();

      // Create SVG
      const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${containerWidth} ${height}`);
      // Create scales
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([margin.left, containerWidth - margin.right])
        .padding(0.2);

        const yScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([height - margin.bottom, margin.top]);

      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale)
        .tickValues([0, 500, 1000]);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);

      // Add grid lines
      svg.selectAll('yGrid')
        .data(yScale.ticks())
        .join('line')
        .attr('x1', margin.left)
        .attr('x2', containerWidth - margin.right)
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
        <div style={{ position: 'relative' }} ref={containerRef}>
        <h3 style={{ marginBottom: '10px', color: '#2d3748' }}>Last 7 Days</h3>
        <div ref={svgRef} style={{ width: '100%', overflow: 'visible' }} />
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
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                height: '150px', // Changed from minHeight to fixed height
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            onClick={() => navigate('/accounts')}
        >
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
            }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{cardName}</h3>
                <div style={{ 
                    color: '#e53e3e', 
                    fontWeight: '600',
                    fontSize: '1.1rem'
                }}>
                    -${usedAmount.toFixed(2)}
                </div>
            </div>

            <div 
                style={{
                    position: 'relative',
                    height: '6px',
                    backgroundColor: '#f0f2f5',
                    borderRadius: '3px'
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
            >
                <div 
                    style={{
                        height: '100%',
                        backgroundColor: '#e53e3e',
                        borderRadius: '3px',
                        width: `${usagePercentage}%`,
                        transition: 'width 0.3s ease'
                    }}
                />
                
                {tooltipVisible && (
                    <div 
                        style={{
                            position: 'absolute',
                            background: '#2d3748',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            left: `${tooltipPosition.x}px`,
                            top: `${tooltipPosition.y}px`,
                            pointerEvents: 'none',
                            zIndex: 100
                        }}
                    >
                        ${usedAmount.toFixed(2)} / ${limit.toFixed(2)}
                    </div>
                )}
            </div>

            <div style={{ 
                color: '#718096',
                fontSize: '0.9rem',
                textAlign: 'right',
                paddingTop: '10px',
                borderTop: '1px solid #eee'
            }}>
                <div style={{ fontSize: '1rem' }}>
                    {usagePercentage}% of limit used
                </div>
                <div style={{ 
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    marginTop: '8px'
                }}>
                    Limit: ${limit.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

  


const DashboardPage = () => {

    const [thisMonthData] = useState([
        { label: 'Income', value: 6500, color: '#008000' },
        { label: 'Expenses', value: 4200, color: '#e53e3e' }
      ]);
    
    const [budgetData] = useState([
        { label: 'Allocated', value: 8000, color: '#008000' },
        { label: 'Used', value: 800, color: '#e53e3e' }
    ]);

    const navigate = useNavigate();

    useEffect(()=>{
      if (!localStorage.getItem('token')){
        navigate('/auth')
      }

    })

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
        
        <div className="floating-buttons-container">
        <button className="floating-button add" onClick={() => {}}>
          <span className="floating-button-icon">+</span>
        </button>
        <button className="floating-button subtract" onClick={() => {}}>
          <span className="floating-button-icon">-</span>
        </button>
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
          minHeight: '180px',
          cursor: 'pointer'
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
        cursor: 'pointer'
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
        minHeight: '180px',
        cursor: 'pointer'
        }} onClick={() => handleContainerClick('/budgets')}>
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
            minHeight: '400px',
            gridColumn: 'span 2',
            width: '100%',
            maxWidth: '650px', // Matches the double width
            margin: '0 auto',
            cursor: 'pointer'
        }} onClick={() => handleContainerClick('/transactions')}>
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
  

  export default DashboardPage;