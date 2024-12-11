import React, { useCallback, useState } from 'react';
import splitCID from '@/utils/fileUtils/splitCID';
import { useContract } from '@/hooks/useContract';
import connectContract from '@/utils/web3Utils/connectContract';
import * as Git from 'isomorphic-git';
import { openDB } from 'idb';

declare global {
  interface Window {
    BFS: any; // You can narrow this down further, but for now, use 'any' to avoid type issues
  }
}




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





const RepoUpload = () => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('');
  const [infoHash, setInfoHash] = useState('')



  const uploadFolder = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!title || !description) {
      alert("Please fill in the title and description before uploading.");
      return;
    }

    try{
        //@ts-ignore
        const client = new WebTorrent({
          tracker: ['wss://tracker.webtorrent.io'] // Example of a WebTorrent tracker
        });      // const response = await uploadToMoralis(files);
      // const cid = splitCID(response);
      // console.log(cid)

      if(!files) return;

      const fileList = Array.from(files).map((file) => ({
        name: file.name,
        path: (file as any).webkitRelativePath || file.name, // Use relative path if available
        size: file.size,
        type: file.type,
      }));


      const { contract, accounts } = await connectContract();
      const db = await initDB();
      await db.put('repos',{name: title, description: description, data: fileList})


      const infoHash = await new Promise<string>((resolve, reject) => {
        client.seed(files, (torrent: any) => {
          console.log(`Seeding in browser! Infohash: ${torrent.infoHash}`);
          console.log(`Magnet URI: ${torrent.magnetURI}`);
          resolve(torrent.infoHash);
        });
      });

      setInfoHash(infoHash); // Update the state with the generated infoHash

      if(infoHash! == '')
        {
            console.log('infoHash is empty');
            return;
        }
      
        const res = await contract.methods.createRepo(title, description,infoHash,false).send({ from: accounts[0] });
        console.log(res);


      // console.log(title,description,cid);
     
    }catch(e)
    {
      alert(e);
    }
  },
  [title, description] 
);




  return (
    <>
    <script src="https://cdn.jsdelivr.net/npm/browserfs"></script>
    <script src="https://cdn.jsdelivr.net/npm/webtorrent/webtorrent.min.js"></script>
      <div className="pt-[100px] flex flex-col gap-4 w-auto items-center justify-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-white"
          placeholder="Repo Name"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-white"
          placeholder="Repo Description"
        />
        <input
          type="file"
          {...({ webkitdirectory: "true" })}
          multiple
          {...({ mozdirectory: "true" })}
          {...({ directory: "true" })}
          onChange={uploadFolder}
          {...({} as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      </div>
      </>
  );
};

export default RepoUpload;
