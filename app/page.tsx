"use client";
import { useState, useRef, useEffect } from "react";
import { Trie } from "@/lib/trie";
import data from "@/app/data.json";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);

  const trie = useRef(new Trie());

  useEffect(() => {
    Object.entries(data).forEach(([name, phone]) => {
      trie.current.insert(name, phone);
    });
  }, []);

  useEffect(() => {
    if (query === "") {
      setResults([]);
      setSelectedName(null);
      setPhoneNumber(undefined);
      return;
    }
    const matches = trie.current.searchPrefix(query);
    setResults(matches);
  }, [query]);

  const handleSelect = (name: string) => {
    setSelectedName(name);
    setPhoneNumber(trie.current.getPhoneNumber(name));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Enter the name to search for it
        </h1>
      </div>

      {/* Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Type name or prefix..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Results */}
      <nav className="border border-gray-300 rounded-md max-w-md mb-6">
        {results.length === 0 && query !== "" && (
          <p className="p-4 text-gray-500 italic">No results found</p>
        )}
        <ul>
          {results.map((name) => (
            <li
              key={name}
              onClick={() => handleSelect(name)}
              className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${
                name === selectedName ? "bg-blue-200 font-semibold" : ""
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      </nav>

      {/* Selected name + number + copy */}
      {selectedName && phoneNumber && (
        <div className="flex items-center justify-between border border-gray-300 rounded-md p-4 max-w-md">
          <div>
            <p className="font-bold">{selectedName}</p>
            <p className="text-gray-700">{phoneNumber}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(phoneNumber);
              alert("Copied to clipboard!");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Copy
          </button>
        </div>
      )}
      <div className="items-center">
        <p>Made by Paul Samy - V1.0</p>
      </div>
    </div>
  );
}
