import Repobar from '@/components/Repobar'
import RepoDashboard from '@/components/RepoDashboard'
import React, { useEffect } from 'react'

function index() {


  useEffect(()=>{


    const downloadData = async (infoHash:string) => {
      try {
        //@ts-ignore
        const client = new WebTorrent();
    
        console.log(`Connecting to the swarm with infoHash: ${infoHash}`);
    
        // Add the torrent using its infoHash
        client.add(infoHash, (torrent) => {
          console.log(`Torrent added! Name: ${torrent.name}`);
    
          torrent.files.forEach(async (file) => {
            console.log(`Downloading file: ${file.name}`);
    
            // Get the file as a Blob or ArrayBuffer
            file.getBlob(async (err, blob) => {
              if (err) {
                console.error(`Error downloading file ${file.name}:`, err);
                return;
              }
    
              // Create a download link for the file
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = file.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
    
              console.log(`File downloaded: ${file.name}`);
            });
          });
    
          torrent.on('done', () => {
            console.log('Torrent download complete!');
            client.destroy(); // Clean up the WebTorrent client
          });
        });
      }
      catch(e)
      {
        console.log('error')
      }
    }
    downloadData("9fdbf1c2623edd6fd609733197e94d665561086e")
  },[]);
  

      

  return (
    <div>
      <div className ="mt-[100px]">
      <Repobar/>
      </div>
     <RepoDashboard/>

    </div>
  )
}

export default index;

