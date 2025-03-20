"use client";
import React, { useEffect, useState } from 'react';
import { MessageSquare, Clock, Plus, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
import api from '@/utils/api';

interface laboratory{
  id:string;
  labId:string;
  labName:string;
  email:string;
  location:string;


}
const LaboratoryPage = () => {
  const router = useRouter();
  const [addedLaboratories, setAddedLaboratories] = useState<laboratory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [laboratories,setLaboratories] = useState<laboratory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ListFetchHomeData = async () => {
    try {
      const response = await api.get("/patient/laboratories");
      setLaboratories(response.data as laboratory[]);
      console.log(response);
      setError(null);
    } catch (error) {
      console.error("Error fetching laboratories:", error);
      setError("Failed to load laboratories. Please try again.");
    }
  };
  useEffect(() => {
    ListFetchHomeData();
  }, []);

  // Filter pharmacies based on search query
  const filteredLaboratories = laboratories.filter(laboratory => 
    laboratory.labName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    laboratory.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLaboratory = (laboratory: laboratory) => {
    if (laboratory && !addedLaboratories.some(lab => lab.labId === laboratory.labId)) {
      setAddedLaboratories([...addedLaboratories, laboratory]);
      setSearchQuery('');
    }
  };

  const handleRemoveLaboratory = (laboratoryId: string) => {
    setAddedLaboratories(addedLaboratories.filter(lab => lab.id !== laboratoryId));
  };

  const handleMessageClick = () => {
    router.push('/dashboard/patient/laboratory/message');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar with Add Button */}
          <div className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search laboratories by name, specialty, or address..."
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
              <button
                onClick={() => filteredLaboratories.length>0 && handleAddLaboratory (filteredLaboratories[0])}
                className="px-4 py-3 bg-blue-500 text-white font-medium rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-colors"
                disabled={filteredLaboratories.length === 0}
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>


             {/* Available Laboratories */}
        {searchQuery && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold p-4 border-b">Search Results</h2>
            {filteredLaboratories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No Laboratories found matching your search.
              </div>
            ) : (
              <div className="divide-y">
                {filteredLaboratories.map(laboratory => (
                  <div key={laboratory.id || laboratory.labId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{laboratory.labName}</h3>
                      <p className="text-sm text-gray-500">{laboratory.location}</p>
                    </div>
                   
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

          {/* Selected Laboratories */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold p-4 border-b">Selected Laboratories</h2>
          {addedLaboratories.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No laboratories selected yet.
            </div>
          ) : (
            <div className="divide-y">
              {addedLaboratories.map(laboratory => (
                <div key={laboratory.id || laboratory.labId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium">{laboratory.labName}</h3>
                    <p className="text-sm text-gray-500">{laboratory.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleMessageClick}
                      className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                    >
                      <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleRemoveLaboratory(laboratory.id || laboratory.labId)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
export default LaboratoryPage;






