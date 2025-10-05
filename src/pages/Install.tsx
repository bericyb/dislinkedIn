import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const steps = [
  {
    number: '01',
    title: 'Download Extension',
    description: 'Click the button below to download the DislinkedIn extension as a ZIP file.',
    icon: <i className="hn hn-download text-5xl"></i>,
  },
  {
    number: '02',
    title: 'Unzip the File',
    description: 'Extract the downloaded ZIP file to a folder on your computer.',
    icon: <i className="hn hn-folder text-5xl"></i>,
  },
  {
    number: '03',
    title: 'Open Extensions',
    description: 'Navigate to chrome://extensions/ in your Chrome browser.',
    icon: <i className="hn hn-chrome text-5xl"></i>,
  },
  {
    number: '04',
    title: 'Enable Developer Mode',
    description: 'Toggle the "Developer mode" switch in the top right corner.',
    icon: <i className="hn hn-settings text-5xl"></i>,
  },
  {
    number: '05',
    title: 'Load Unpacked',
    description: 'Click "Load unpacked" and select the unzipped extension folder.',
    icon: <i className="hn hn-upload text-5xl"></i>,
  },
  {
    number: '06',
    title: 'Start Disliking',
    description: 'Visit LinkedIn and start expressing your true feelings on posts!',
    icon: <i className="hn hn-thumbs-down text-5xl"></i>,
  },
];

export default function Install() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-[120px] pb-[80px] px-[40px]">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-[80px] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-[40px]">
            Install <span className="text-primary">DislinkedIn</span>
          </h1>
          <p className="text-xl text-foreground/70 mb-[60px] max-w-2xl mx-auto">
            Follow these simple steps to install the extension and start disliking posts on LinkedIn
          </p>

          {/* Download Button */}
          <a
            href="/dislinkedin-extension.zip"
            download="dislinkedin-extension.zip"
            className="inline-flex items-center gap-[20px] px-[60px] py-[30px] bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 card-corners relative"
          >
            <span className="corner-bottom-left">+</span>
            <span className="corner-bottom-right">+</span>
            <i className="hn hn-download text-3xl"></i>
            Download DislinkedIn.zip
          </a>
        </motion.div>

        {/* Installation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] mb-[80px]">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-[40px] hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center">
                <div className="text-4xl font-bold text-primary mb-[20px]">{step.number}</div>
                <div className="mb-[40px] text-primary">{step.icon}</div>
                <CardHeader className="p-0">
                  <CardTitle className="text-xl mb-[20px]">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="p-[40px] aspect-auto">
            <CardHeader className="p-0 mb-[20px]">
              <CardTitle className="text-2xl mb-[20px]">Need Help?</CardTitle>
            </CardHeader>
            <div className="space-y-[20px] text-foreground/70">
              <p>
                <strong className="text-foreground">Troubleshooting:</strong> If the extension doesn't appear after loading, try refreshing the LinkedIn page or restarting Chrome.
              </p>
              <p>
                <strong className="text-foreground">Chrome Web Store:</strong> We're working on getting DislinkedIn published to the Chrome Web Store for easier installation.
              </p>
              <p>
                <strong className="text-foreground">Questions?</strong> Create an issue on our GitHub repository or contact us.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Navigation Links */}
        <div className="mt-[60px] flex flex-col sm:flex-row gap-[40px] justify-center items-center">
          <Link
            to="/"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
          {user && (
            <Link
              to="/feed"
              className="px-[40px] py-[20px] border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 transition-all font-semibold card-corners relative flex items-center gap-[20px]"
            >
              <span className="corner-bottom-left">+</span>
              <span className="corner-bottom-right">+</span>
              View Feed →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
