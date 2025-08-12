'use client';
import { Card } from "@/components/ui/card";
import { LineChart } from "../../components/ui/charts";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Activity, Box, Users, Wrench } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  products: number;
  users: number;
}

export default function DashboardPage() {
  const [cookies] = useCookies(['refreshToken']);
  const [stats, setStats] = useState<Stats>({ products: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('https://stockflowbackend-2j27.onrender.com/products');
        const productsData = await productsRes.json();
        
        // Fetch users (with auth token)
        const usersRes = await fetch('https://stockflowbackend-2j27.onrender.com/users', {
          headers: {
            'Authorization': `Bearer ${cookies.refreshToken}`
          }
        });
        const usersData = await usersRes.json();

        setStats({
          products: productsData.length,
          users: usersData.length
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cookies.refreshToken]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
             Dashboard
          </h1>
          <div className="flex items-center gap-2 text-yellow-400">
            <Wrench className="h-5 w-5" />
            <span>Admin Tools</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500/30 transition-colors p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <Box className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-gray-400">Total Products</h3>
                  {loading ? (
                    <div className="h-8 w-20 bg-gray-800 rounded animate-pulse mt-2" />
                  ) : (
                    <p className="text-3xl font-bold mt-1">{stats.products}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500/30 transition-colors p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <Users className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-gray-400">Registered Users</h3>
                  {loading ? (
                    <div className="h-8 w-20 bg-gray-800 rounded animate-pulse mt-2" />
                  ) : (
                    <p className="text-3xl font-bold mt-1">{stats.users}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500/30 transition-colors p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <Activity className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-gray-400">Active Sessions</h3>
                  <p className="text-3xl font-bold mt-1">Coming Soon</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Development Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-8 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Under Development
            </h2>
            <p className="text-lg text-gray-300">
              We're actively working on this dashboard to bring you more features and insights.
              Thank you for your patience and support!
            </p>
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                <Wrench className="h-4 w-4" />
                Development in Progress
              </span>
            </div>
          </div>
        </motion.div>

        {/* Empty Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Analytics Coming Soon</h2>
              <span className="text-sm text-yellow-400">Preview</span>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="text-gray-400">Detailed analytics will be available soon</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}