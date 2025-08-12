'use client'
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, ChevronDown,
  PlusCircle, Search, Filter, X, Crown, Shield, Key,
  Activity, Clock, TrendingUp, BarChart2, RefreshCw, Calendar, ArrowUpDown,
  Check, ChevronsUpDown, ListFilter, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster, toast } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { UserForm } from "../users/components/userForm";


const FloatingBubbles = () => {
  const [bubbles, setBubbles] = useState<Array<any>>([]);

  useEffect(() => {
    const generatedBubbles = Array.from({ length: 15 }, (_, i) => {
      const size = Math.random() * 200 + 50;
      return {
        id: i,
        size,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        moveX: Math.random() * 80 - 40,
        moveY: Math.random() * 80 - 40,
        duration: Math.random() * 15 + 15,
        opacity: Math.random() * 0.2 + 0.05,
        delay: Math.random() * 5
      };
    });
    setBubbles(generatedBubbles);
  }, []);

  if (bubbles.length === 0) return null;

  return (
    <div className=" inset-1 overflow-hidden pointer-events-none -z-10">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600"
          initial={{
            x: `${bubble.initialX}vw`,
            y: `${bubble.initialY}vh`,
            opacity: bubble.opacity
          }}
          animate={{
            x: [
              `${bubble.initialX}vw`, 
              `${bubble.initialX + bubble.moveX}vw`,
              `${bubble.initialX}vw`
            ],
            y: [
              `${bubble.initialY}vh`,
              `${bubble.initialY + bubble.moveY}vh`,
              `${bubble.initialY}vh`
            ],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: bubble.delay
          }}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  );
};

interface User {
  id: number;
  name: string;
  familyName: string;
  email: string;
  cin: string;
  isActive: boolean;
  role: 'admin' | 'manager' | 'user';
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'role-asc' | 'role-desc';

const UsersPage = () => {
  const [cookies] = useCookies(['refreshToken']);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    managers: 0,
    regularUsers: 0,
    lastUpdated: new Date().toISOString()
  });

  const roleOptions = [
    { value: 'admin', label: 'Admin', icon: <Crown size={16} />, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'manager', label: 'Manager', icon: <Shield size={16} />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { value: 'user', label: 'User', icon: <UserIcon size={16} />, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', icon: <CheckCircle size={16} />, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'inactive', label: 'Inactive', icon: <XCircle size={16} />, color: 'bg-red-500/20 text-red-400 border-red-500/30' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)', icon: <ChevronsUpDown size={16} /> },
    { value: 'name-desc', label: 'Name (Z-A)', icon: <ChevronsUpDown size={16} /> },
    { value: 'date-asc', label: 'Oldest', icon: <Calendar size={16} /> },
    { value: 'date-desc', label: 'Newest', icon: <Calendar size={16} /> },
    { value: 'role-asc', label: 'Role (A-Z)', icon: <ChevronsUpDown size={16} /> },
    { value: 'role-desc', label: 'Role (Z-A)', icon: <ChevronsUpDown size={16} /> }
  ];

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);
  
  const fetchUsers = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const response = await fetch('https://stockflowbackend-2j27.onrender.com/users', {
        headers: {
          'Authorization': `Bearer ${cookies.refreshToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
      applyFilters(data, searchTerm, roleFilter, statusFilter, sortOption);
      
      // Calculate statistics
      const active = data.filter((user: User) => user.isActive).length;
      const inactive = data.length - active;
      const admins = data.filter((user: User) => user.role === 'admin').length;
      const managers = data.filter((user: User) => user.role === 'manager').length;
      const regularUsers = data.length - admins - managers;
      
      setStats({
        total: data.length,
        active,
        inactive,
        admins,
        managers,
        regularUsers,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const applyFilters = (usersList: User[], search: string, role: string, status: string, sort: SortOption) => {
    let filtered = [...usersList];
    
    // Apply search filter
    if (search.trim() !== '') {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.familyName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.cin.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply role filter
    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(user => 
        status === 'active' ? user.isActive : !user.isActive
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return `${a.name} ${a.familyName}`.localeCompare(`${b.name} ${b.familyName}`);
        case 'name-desc':
          return `${b.name} ${b.familyName}`.localeCompare(`${a.name} ${a.familyName}`);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'role-asc':
          return a.role.localeCompare(b.role);
        case 'role-desc':
          return b.role.localeCompare(a.role);
        default:
          return 0;
      }
    });
    
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters(users, searchTerm, roleFilter, statusFilter, sortOption);
  }, [searchTerm, roleFilter, statusFilter, sortOption, users]);

  const handleAdd = () => {
    setCurrentUser(null);
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://stockflowbackend-2j27.onrender.com/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${cookies.refreshToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      toast.success('User deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const toggleUserStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`https://stockflowbackend-2j27.onrender.com/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.refreshToken}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update user status');
      
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user status');
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormSuccess = () => {
    setIsModalVisible(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <motion.h1 
                className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                User Management Dashboard
              </motion.h1>
              <p className="text-gray-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
              <time dateTime="2024-08-11" suppressHydrationWarning>
  {new Date().toLocaleTimeString()}
</time>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                      onClick={handleRefresh}
                    >
                      {isRefreshing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium shadow-lg hover:shadow-yellow-500/30 transition-all group"
                >
                  <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                  Add User
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Statistics Section */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="grid w-full  grid-cols-2 bg-gray-900 border border-gray-800 ">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800  data-[state=active]:text-yellow-400 ">
                <BarChart2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-gray-800 data-[state=active]:text-yellow-400">
                <TrendingUp className="h-4 w-4 mr-2" />
                Comparison
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                      <UserIcon className="h-4 w-4 text-yellow-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                    <p className="text-xs text-gray-400 mt-1">All registered users</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
                      <Activity className="h-4 w-4 text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">{stats.active}</div>
                    <p className="text-xs text-gray-400 mt-1">{Math.round((stats.active / stats.total) * 100)}% of total</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-400">Pending Verification</CardTitle>
                      <Clock className="h-4 w-4 text-yellow-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400">{stats.inactive}</div>
                    <p className="text-xs text-gray-400 mt-1">{Math.round((stats.inactive / stats.total) * 100)}% of total</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="comparison">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-400">Active vs Inactive</CardTitle>
                      <Activity className="h-4 w-4 text-yellow-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-400">Active: {stats.active}</span>
                      <span className="text-sm text-yellow-400">Inactive: {stats.inactive}</span>
                    </div>
                    <Progress 
                      value={(stats.active / stats.total) * 100} 
                      className="h-2 bg-gray-800"
                      indicatorClassName="bg-gradient-to-r from-green-500 to-yellow-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-400">User Roles</CardTitle>
                      <Shield className="h-4 w-4 text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-gray-300">Admins</span>
                        </div>
                        <span className="text-xs font-medium text-white">{stats.admins}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-400" />
                          <span className="text-xs text-gray-300">Managers</span>
                        </div>
                        <span className="text-xs font-medium text-white">{stats.managers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-300">Users</span>
                        </div>
                        <span className="text-xs font-medium text-white">{stats.regularUsers}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 via-blue-500 to-gray-500 h-1.5 rounded-full" 
                        style={{
                          width: '100%',
                          backgroundSize: `${stats.admins}% ${stats.managers}% ${stats.regularUsers}%`,
                          backgroundImage: `linear-gradient(
                            to right,
                            #f59e0b ${(stats.admins / stats.total) * 100}%,
                            #3b82f6 ${(stats.admins / stats.total) * 100}% ${((stats.admins + stats.managers) / stats.total) * 100}%,
                            #6b7280 ${((stats.admins + stats.managers) / stats.total) * 100}% 100%
                          )`
                        }}
                      />
                    </div>
                  </CardFooter>
                </Card>
                
                <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-400">User Activity</CardTitle>
                      <TrendingUp className="h-4 w-4 text-yellow-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#1f2937"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="url(#activeGradient)"
                            strokeWidth="3"
                            strokeDasharray={`${(stats.active / stats.total) * 100}, 100`}
                          />
                          <defs>
                            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {Math.round((stats.active / stats.total) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2">Active users percentage</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name, email, or CIN..."
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-yellow-500/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="min-w-[150px] bg-gray-800 border-gray-700 text-white">
                      <div className="flex items-center gap-2">
                        <ListFilter size={16} />
                        <SelectValue placeholder="Filter by role" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} />
                          All Roles
                        </div>
                      </SelectItem>
                      {roleOptions.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            {role.icon}
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="min-w-[150px] bg-gray-800 border-gray-700 text-white">
                      <div className="flex items-center gap-2">
                        <Filter size={16} />
                        <SelectValue placeholder="Filter by status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Activity size={16} />
                          All Statuses
                        </div>
                      </SelectItem>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            {status.icon}
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                    <SelectTrigger className="min-w-[150px] bg-gray-800 border-gray-700 text-white">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown size={16} />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      {sortOptions.map(sort => (
                        <SelectItem key={sort.value} value={sort.value}>
                          <div className="flex items-center gap-2">
                            {sort.icon}
                            {sort.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 w-full rounded-lg bg-gray-800 animate-pulse" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <UserIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">No users found</h3>
                  <p className="text-gray-400 mt-1">
                    {searchTerm ? 'Try adjusting your search or filters' : 'Create your first user to get started'}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      className="mt-4 text-yellow-400 hover:bg-yellow-500/10"
                      onClick={() => {
                        setSearchTerm('');
                        setRoleFilter('all');
                        setStatusFilter('all');
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800 border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">CIN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredUsers.map((user) => (
                        <motion.tr 
                          key={user.id} 
                          className="hover:bg-gray-800/50"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{user.name} {user.familyName}</div>
                                <div className="text-xs text-gray-400">{user.phoneNumber || 'No phone'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.cin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`px-2 h-7 text-xs ${user.isActive ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'}`}
                                  onClick={() => toggleUserStatus(user.id, user.isActive)}
                                >
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">
                                <p>Click to {user.isActive ? 'deactivate' : 'activate'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {roleOptions.find(r => r.value === user.role) ? (
                              <Badge className={roleOptions.find(r => r.value === user.role)?.color}>
                                {roleOptions.find(r => r.value === user.role)?.icon}
                                <span className="ml-1.5">{roleOptions.find(r => r.value === user.role)?.label}</span>
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                {user.role}
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                                    onClick={() => handleEdit(user)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">
                                  <p>Edit user</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:bg-red-500/10 transition-colors"
                                    onClick={() => handleDelete(user.id)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18"></path>
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">
                                  <p>Delete user</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* User Form Dialog */}
        <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {currentUser ? (
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-yellow-400" />
                    Edit User
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-yellow-400" />
                    Create New User
                  </div>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {currentUser ? 'Update user details below' : 'Fill in the form to create a new user'}
              </DialogDescription>
            </DialogHeader>
            
            <UserForm
              initialValues={currentUser || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalVisible(false)}
              isEditMode={!!currentUser}
            />
          </DialogContent>
        </Dialog>

        <Toaster position="top-right" theme="dark" richColors />
      </div>
    </div>
  );
};

export default UsersPage;