import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    title: 'Track Dislikes',
    description: 'See dislike counts on every LinkedIn post in real-time',
    icon: <i className="hn hn-thumbs-down text-6xl"></i>,
  },
  {
    title: 'Most Disliked Feed',
    description: 'Discover the most controversial posts across LinkedIn',
    icon: <i className="hn hn-trending-down text-6xl"></i>,
  },
  {
    title: 'Cloud Sync',
    description: 'Your dislikes sync seamlessly across all devices',
    icon: <i className="hn hn-cloud text-6xl"></i>,
  },
  {
    title: 'Privacy First',
    description: '100% anonymous. Your identity is never revealed',
    icon: <i className="hn hn-lock text-6xl"></i>,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-[120px]">
      <div className="container mx-auto px-[40px]">
        {/* Section Header */}
        <div className="text-center mb-[80px]">
          <h2 className="text-4xl md:text-5xl font-bold mb-[40px]">
            Everything You Need
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            A complete suite of features to track and understand LinkedIn sentiment
          </p>
        </div>

        {/* Features Grid - Grid-aligned: 40px gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] max-w-[1200px] mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-[40px] hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center">
                <div className="mb-[40px] text-primary">{feature.icon}</div>
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl mb-[20px]">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works - Grid-aligned: 160px = 4 grid cells top margin, 40px gap */}
        <div id="how-it-works" className="mt-[160px]">
          <h2 className="text-4xl md:text-5xl font-bold mb-[80px] text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] max-w-[1240px] mx-auto">
            {[
              {
                step: '01',
                title: 'Install the Extension',
                description: 'Download dis-linkedin from the Chrome Web Store and add it to your browser.',
              },
              {
                step: '02',
                title: 'Browse LinkedIn',
                description: 'Use LinkedIn normally. You\'ll see dislike buttons appear on every post.',
              },
              {
                step: '03',
                title: 'Sign In (Optional)',
                description: 'Create an account to see the most disliked posts and sync across devices.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-[40px] hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center">
                  <div className="text-5xl font-bold text-primary mb-[40px]">{item.step}</div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl mb-[20px]">{item.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
