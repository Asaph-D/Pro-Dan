import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import Header from './Header';
import { Card, CardHeader, CardTitle, CardContent } from '../../..//components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Statistics = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const { authToken } = useContext(AuthContext);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    useEffect(() => {
        fetchTopProducts();
        fetchCategoryStats();
    }, []);
    
    const fetchTopProducts = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/produits/statistiques', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setTopProducts(data);
        } catch (error) {
            console.error('Error fetching top products:', error);
        }
    };
    
    const fetchCategoryStats = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/produits', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            
            // Calculate orders by category
            const categories = ['gift', 'cake', 'juice', 'others'];
            const stats = categories.map(category => ({
                name: category.charAt(0).toUpperCase() + category.slice(1),
                orders: data.filter(product => product.category === category)
                    .reduce((sum, product) => sum + (product.compteurCommandes || 0), 0)
            }));
            
            setCategoryStats(stats);
        } catch (error) {
            console.error('Error fetching category statistics:', error);
        }
    };

    return (
        <div>
            <Header title="Statistics" />
            <main className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Table Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {topProducts.map((product, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{product.nom}</td>
                                                <td className="px-6 py-4">{product.compteurCommandes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Charts Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Bar Chart */}
                                <div className="h-64">
                                    <BarChart
                                        width={400}
                                        height={250}
                                        data={categoryStats}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="orders" fill="#8884d8" />
                                    </BarChart>
                                </div>

                                {/* Pie Chart */}
                                <div className="h-64">
                                    <PieChart width={400} height={250}>
                                        <Pie
                                            data={categoryStats}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="orders"
                                        >
                                            {categoryStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Statistics;