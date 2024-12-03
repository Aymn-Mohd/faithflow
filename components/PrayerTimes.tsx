'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Search, X } from 'lucide-react';

interface PrayerTime {
  name: string;
  time: string;
}

interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);

  const searchCities = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      const cities = data.slice(0, 5).map((item: any) => ({
        name: item.display_name.split(',')[0],
        country: item.display_name.split(',').slice(-1)[0].trim(),
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));
      setSearchResults(cities);
    } catch (error) {
      console.error('Error searching cities:', error);
    }
  };

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${lat}&longitude=${lng}&method=2`
      );
      const data = await response.json();
      const timings = data.data.timings;
      
      setPrayerTimes([
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchPrayerTimes(selectedCity.latitude, selectedCity.longitude);
      localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
    } else {
      const savedCity = localStorage.getItem('selectedCity');
      if (savedCity) {
        setSelectedCity(JSON.parse(savedCity));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setSelectedCity({
              name: 'Current Location',
              country: '',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          () => {
            setSelectedCity({
              name: 'London',
              country: 'UK',
              latitude: 51.5074,
              longitude: -0.1278
            });
          }
        );
      }
    }
  }, [selectedCity]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setIsSearching(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <CardTitle className="text-base font-medium text-gray-800">Prayer Times</CardTitle>
          </div>
          <div className="relative">
            {isSearching ? (
              <div className="absolute right-0 top-0 w-64 z-10">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-lg">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      searchCities(e.target.value);
                    }}
                    placeholder="Search location..."
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded-l-lg focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearching(false);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="p-2 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {searchResults.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => handleCitySelect(city)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.country}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsSearching(true)}
                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-700">{selectedCity?.name}</span>
                <Search className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {prayerTimes.map((prayer) => (
            <div key={prayer.name} className="bg-gray-50/50 rounded-xl p-3 text-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-500">{prayer.name}</p>
              </div>
              <p className="text-sm font-medium text-gray-800">{prayer.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 