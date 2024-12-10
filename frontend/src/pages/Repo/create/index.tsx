import React, { useCallback, useState } from 'react';
import uploadToMoralis from '@/utils/uploadToMoralis';
import splitCID from '@/utils/fileUtils/splitCID';
import { useContract } from '@/hooks/useContract';
import connectContract from '@/utils/web3Utils/connectContract';
import { NextPage } from 'next';

const Page: NextPage = () => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('');

  const uploadFolder = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!title || !description) {
      alert("Please fill in the title and description before uploading.");
      return;
    }

    try{
      const response = await uploadToMoralis(files);
      const cid = splitCID(response);
      console.log(cid)
      const { contract, accounts } = await connectContract();
      console.log(title,description,cid);
      const res = await contract.methods.createRepo(title, description,cid,false).send({ from: accounts[0] });
      console.log(res);
    }catch(e)
    {
      alert(e);
    }
  },
  [title, description] 
);

  return (
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
  );
};

export default Page;
