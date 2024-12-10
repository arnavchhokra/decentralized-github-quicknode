import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import RepoCard from '@/components/RepoCard';
import connectContract from '@/utils/web3Utils/connectContract';
import * as Git from 'isomorphic-git';
import { openDB } from 'idb';
import { NextPage } from 'next';




interface Repository {
  name: string;
  repoID: number;
  description: string;
  owners: string[];
  cids: string;
  infoHash:string;
  isBackUpLatest: boolean;
}

const Page: NextPage =() => {

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);



  useEffect(()=>{


    const loadAllRepositories = async() =>{
      const { contract, accounts } = await connectContract();
      const res: Repository[] = await contract.methods.getRepoByUser().call({ from: accounts[0] });
      console.log(res);
      console.log(Number(res[0].repoID));
      setRepositories(res);
    };


    const initDB = async() =>{   
      return openDB('RepoDB',1,{  
        upgrade(db){    // create or update  RepoDB with version 1 
          if(!db.objectStoreNames.contains('repos'))  // Check if repo db has table Repos/ object store
          {  
            db.createObjectStore('repos',{keyPath:'name'}) // makes repos table and  name column Primary key
          }
        }
      })
    }
  
  
  const loader = async() =>{
    const client = new WebTorrent();
    const db = await initDB();
    const tx = db.transaction('repos','readonly');
    const store = tx.objectStore('repos');
  
    const allRepos = await store.getAll();
    await tx.done;
    console.log(`Loaded ${allRepos.length} repositories`);
    allRepos.forEach((repo) => {
      console.log(`Seeding repository: ${repo.name}`);
  
      // Convert the repository data into a format suitable for WebTorrent
      const fileArray = repo.data.map((file: File) => {
        return new File([file], file.name); // Recreate File objects if needed
      });
  
      // Seed the files using WebTorrent client
      client.seed(fileArray, (torrent: any) => {
        console.log(`Seeding started for: ${repo.name}`);
        console.log('Torrent Info:', {
          name: torrent.name,
          magnetURI: torrent.magnetURI,
          infoHash: torrent.infoHash,
        });
  
        // Optional: Handle seeding progress or UI updates
        torrent.on('upload', () => {
          console.log(`Uploading: ${torrent.uploaded} bytes`);
        });
      });
    });
  };

    loader();
    
    loadAllRepositories();
  
  },[]);




  if (loading) return <div>Loading...</div>;


  




  

  return (
    <>
    <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", padding: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
        <span style={{ fontSize: "25px", fontWeight: "600" }}>Your Repositories</span>
        <Button onClick={() => { location.href = 'Repo/add'; }}>New Repository</Button>
      </div>
      <div style={{ width: "80%", marginTop: "30px" }}>
        {repositories.length > 0 ? (
          repositories.map((repo) => (
            <RepoCard
              id={Number(repo.repoID)}
              title={repo.name}
              description={repo.description}
              creatorAddress={repo.infoHash}
              link={`/Repo/${Number(repo.repoID)}`}
            />
          ))
        ) : (
          <div>No repositories found.</div>
        )}
      </div>
    </div>
    </>
  );
};

export default Page;