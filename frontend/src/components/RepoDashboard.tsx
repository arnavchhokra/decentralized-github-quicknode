import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from "axios";
import connectContract from "@/utils/web3Utils/connectContract";
import { create } from 'ipfs-http-client';
import { getIPFSFolder, getIPFSFolderAlternative } from "./retrieveIPFS";
import { openDB } from 'idb';

interface RepositoryType {
  name: string;
  repoID: number;
  description: string;
  owners: string[];
  cids: string;
  infoHash: string;
  isBackUpLatest: boolean;
}

const RepoDashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [desc, setDesc] = useState<string>("Repository description");
  const [repoId, setRepoId] = useState(0);
  const [mounted, setMounted] = useState(false); // To track client-side rendering
  const [repo, setRepo] = useState<string[]>([]); // Assuming repo will be an array of strings (file names)

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const segments = window.location.pathname.split('/');
      setRepoId(Number(segments[2]));
    }
  }, [mounted]);

  const fetchRepoData = async () => {
    try {
      const { contract, accounts } = await connectContract();

      if (!repoId) return;

      const response: RepositoryType = await contract.methods
        .getRepoByID(repoId)
        .call({ from: accounts[0] });

      setName(response.name);
      setDesc(response.description);
      console.log(response);
    } catch (error) {
      console.error("Error fetching repository data:", error);
    }
  };

  const initDB = async () => {
    return openDB('RepoDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('repos')) {
          db.createObjectStore('repos', { keyPath: 'name' });
        }
      },
    });
  };

  const downloadData = async (infoHash) => {
    const db = await initDB();
    const tx = db.transaction('repos', 'readonly');
    const store = tx.objectStore('repos');
    const allRepos = await store.getAll();
    await tx.done;
    allRepos.forEach((repo) => {
      console.log(`Seeding repository: ${repo.name}`);

      const fileArray = repo.data.map((file: File) => {
        return file.name; // Recreate File objects if needed
      });

      setRepo(fileArray); // Set the file names into the repo state
      console.log(fileArray);
    });
  };

  useEffect(() => {
    fetchRepoData();
  }, [repoId]);

  useEffect(() => {
    downloadData("a91474d96e93c12d96de75beb4125f5c0c7ddeef");
  }, []);

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
                <div>
                  <b>Seeders</b> : 0 <b>Leeches</b> : 0
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
              <div className="relative pb-[30%] h-0 overflow-hidden bg-grey-500">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>File URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repo.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file}</TableCell>
                    <TableCell>{/* Add logic to display file URL if applicable */}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
