'use client'

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from "axios";
import connectContract from "@/utils/web3Utils/connectContract";
import { create } from 'ipfs-http-client';
import { getIPFSFolder, getIPFSFolderAlternative } from "./retrieveIPFS";

interface RepositoryType {
  id: number;
  name: string;
  description: string;
  owners: string[];
  cids: string;
  dateCreated: bigint;
  lastCommitTime: bigint;
  isEncrypted: boolean;
  commitHistory: string[];
}

const RepoDashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [desc, setDesc] = useState<string>("Repository description");
  const [dateCreated, setDateCreated] = useState<number>(0);
  const [owners, setOwners] = useState<string[]>([]);
  const [commitHistory, setCommitHistory] = useState<string[]>([]);
  const [cid, setCid] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [lastCommitTime, setLastCommitTime] = useState<number>(0);
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]); // Store files with name and URL
  const [repoId, setRepoId] = useState(0);
  const [mounted, setMounted] = useState(false); // To track client-side rendering

  useEffect(() => {
    // Ensure this runs only on the client side
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const segments = window.location.pathname.split('/');
      console.log(segments)
      setRepoId(Number(segments[2]));
      console.log(repoId); // This should now be safe to run on the client side
    }
  }, [mounted]); // Run only after the component has mounted

  const fetchRepoData = async () => {
    try {
      const { contract, accounts } = await connectContract();

      if (!repoId) return;

      const response: RepositoryType = await contract.methods
        .getRepoByID(repoId)
        .call({ from: accounts[0] });
      setName(response.name);
      setDesc(response.description);
      setOwners(response.owners);
      setCommitHistory(response.commitHistory);
      setCid(response.cids);
      setDateCreated(Number(response.dateCreated)); // Convert BigInt to number
      setLastCommitTime(Number(response.lastCommitTime)); // Convert BigInt to number
      setIsEncrypted(response.isEncrypted);
      console.log(response);
      console.log(cid, " is cid")
    } catch (error) {
      console.error("Error fetching repository data:", error);
    }
  };

  // const fetchDirectory = async () => {
  //   const text = getIPFSFolderAlternative();
  //   console.log(text);
  // };

  useEffect(() => {
    fetchRepoData();
  }, [repoId]); // Fetch repo data whenever repoId changes


  useEffect(() => {
    console.log("CID updated:", cid); // Check if the CID is updated correctly
  }, [cid]);
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "30px 10%" }}>
      {!name ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            <div style={{ width: "80%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button style={{ width: "30px", height: "30px", borderRadius: "50%", background: "red" }}></button>
                  <p>{name}</p>
                  <Badge variant="outline">Private</Badge>
                </div>
                <div style={{ gap: "10px", display: "flex" }}>
                  <Popover>
                    <PopoverTrigger style={{ background: "white", color: "black", borderRadius: "5px", padding: "2px 5px", fontSize: '14px', fontWeight: '500' }}>Add files</PopoverTrigger>
                    <PopoverContent>
                      <div style={{ padding: "10px", width: "200px" }}>
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        <Button style={{ marginTop: "10px" }}>
                          Upload
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline">Zip</Button>
                  <Button>Fork</Button>
                </div>
              </div>
              <div className="relative pb-[30%] h-0 overflow-hidden bg-red-500 ">
                {(
                  <embed
                    type="text/html"
                    src={`https://ipfs.io/ipfs/${cid}/`}
                    className="absolute top-0 left-0 w-full h-[450px]"
                  ></embed>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "50px" }}>
            <h2>ABOUT</h2>
            <p style={{ marginTop: "20px" }}>{desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoDashboard;
