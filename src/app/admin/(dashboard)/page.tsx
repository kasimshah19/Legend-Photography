import { connectMongo } from '@/lib/mongodb';
import { Inquiry } from '@/lib/models/Inquiry';
import { Portfolio } from '@/lib/models/Portfolio';
import Link from 'next/link';
import { ArrowRight, Image as ImageIcon, MessageSquare, Film, Plus } from 'lucide-react';

async function getDashboardData() {
  try {
    await connectMongo();
    
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'NEW' });
    
    const totalPortfolios = await Portfolio.countDocuments();
    const publishedPortfolios = await Portfolio.countDocuments({ published: true });

    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentPortfolios = await Portfolio.find().sort({ createdAt: -1 }).limit(5).lean();

    return {
      metrics: {
        totalInquiries,
        newInquiries,
        totalPortfolios,
        publishedPortfolios,
      },
      recentInquiries: JSON.parse(JSON.stringify(recentInquiries)),
      recentPortfolios: JSON.parse(JSON.stringify(recentPortfolios)),
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data from DB, falling back to empty:", error);
    return {
      metrics: {
        totalInquiries: 0,
        newInquiries: 0,
        totalPortfolios: 0,
        publishedPortfolios: 0,
      },
      recentInquiries: [],
      recentPortfolios: [],
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { metrics, recentInquiries, recentPortfolios } = data;

  return (
    <div className="space-y-8 font-sans">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/portfolio" className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
          <Plus size={16} className="mr-2" />
          New Album
        </Link>
        <Link href="/admin/inquiries" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
          <MessageSquare size={16} className="mr-2" />
          View Inquiries
        </Link>
        <Link href="/admin/films" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
          <Film size={16} className="mr-2" />
          Add Film
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Albums" 
          value={metrics.totalPortfolios} 
          icon={<ImageIcon size={20} className="text-gray-500" />} 
        />
        <MetricCard 
          title="Published Albums" 
          value={metrics.publishedPortfolios} 
          icon={<ImageIcon size={20} className="text-gray-500" />} 
        />
        <MetricCard 
          title="Total Inquiries" 
          value={metrics.totalInquiries} 
          icon={<MessageSquare size={20} className="text-gray-500" />} 
        />
        <MetricCard 
          title="New Inquiries" 
          value={metrics.newInquiries} 
          icon={<MessageSquare size={20} className="text-gray-500" />} 
          highlight={metrics.newInquiries > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-base font-semibold text-gray-900">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentInquiries.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No inquiries yet.</p>
            ) : (
              recentInquiries.map((inq: any) => (
                <div key={inq._id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{inq.name}</p>
                    <p className="text-xs text-gray-500">{inq.service} • {new Date(inq.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${inq.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {inq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Albums */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-base font-semibold text-gray-900">Recent Albums</h3>
            <Link href="/admin/portfolio" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPortfolios.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No albums published yet.</p>
            ) : (
              recentPortfolios.map((port: any) => (
                <div key={port._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded object-cover overflow-hidden mr-4 shrink-0 flex items-center justify-center">
                    {port.coverImage ? (
                      <img src={port.coverImage} alt={port.title} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{port.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{port.category}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, highlight = false }: { title: string, value: number | string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className={`mt-1 text-2xl font-semibold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>{value}</p>
      </div>
      <div className="ml-4 shrink-0 p-3 bg-gray-50 rounded-full">
        {icon}
      </div>
    </div>
  );
}
