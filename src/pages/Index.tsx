
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from '../components/Globe';
import { AlertTriangle, BarChart3, Bell, Zap } from 'lucide-react';

const Index: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const features = [
    {
      title: 'Real-time Crisis Monitoring',
      description: 'Track global events as they unfold with instant updates and alerts.',
      icon: <AlertTriangle className="h-6 w-6 text-crisis-high" />,
      delay: 100
    },
    {
      title: 'AI-Powered Analytics',
      description: 'Harness the power of artificial intelligence to predict and prevent crises.',
      icon: <Zap className="h-6 w-6 text-primary" />,
      delay: 200
    },
    {
      title: 'Comprehensive Data Visualization',
      description: 'Understand complex situations at a glance with intuitive visual dashboards.',
      icon: <BarChart3 className="h-6 w-6 text-crisis-medium" />,
      delay: 300
    },
    {
      title: 'Custom Alert System',
      description: 'Set up personalized notifications for regions and crisis types you care about.',
      icon: <Bell className="h-6 w-6 text-crisis-low" />,
      delay: 400
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                Introducing CrisisScope
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Detect & Prevent Crises in <span className="text-primary">Real Time</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Stay ahead of global events with our AI-powered crisis monitoring platform. 
                Visualize, analyze, and respond to emerging threats before they escalate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/dashboard" 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium text-center transition-all"
                >
                  Start Monitoring Now
                </Link>
                <button className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-lg font-medium transition-all">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className={`relative w-full h-80 md:h-96 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 md:w-80 md:h-80">
                  <Globe />
                </div>
              </div>
              
              {/* Visual elements */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-crisis-high rounded-full animate-pulse-gentle" />
              <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-crisis-medium rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-crisis-low rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-secondary/30 rounded-tr-full" />
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Crisis Monitoring</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to stay informed and take action during critical situations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`crisis-card p-6 transition-all duration-700 delay-${feature.delay} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="mb-4 p-3 rounded-lg inline-block bg-secondary/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join organizations worldwide using CrisisScope to monitor, predict, and respond to critical situations in real-time.
          </p>
          <Link 
            to="/dashboard" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-medium text-lg inline-block transition-all"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="font-bold text-2xl tracking-tight">
                <span className="text-primary">Crisis</span>
                <span>Scope</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Real-time crisis monitoring and analysis platform
              </p>
            </div>
            
            <div className="flex gap-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="border-t border-border/60 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CrisisScope. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
