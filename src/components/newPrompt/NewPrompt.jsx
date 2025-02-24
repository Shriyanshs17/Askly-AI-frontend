import { useEffect, useRef, useState } from 'react';
import './newPrompt.css'
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from "../lib/gemini"
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from 'react-query';

const NewPrompt = ({data}) => {
  const [question,setQuestion]=useState("");
  const [answer,setAnswer]=useState("");
   const [img,setImg]=useState({
    isLoading:false,
    error:"",
    dbData:{},
    aiData:{}
   });

   const chat = model.startChat({
    history: [
      ...(data?.history || []).map(({ role, parts }) => ({
        role,
        parts: [{ text: parts?.[0]?.text || '' }], // Ensure parts and text are not undefined
      }))
    ],
    generationConfig: {
      // maxOutputTokens: 1000,
    },
  });

  const endRef=useRef(null);
  const formRef=useRef(null);

  useEffect(()=>{
    endRef.current.scrollIntoView({behavior:"smooth"});
  },[data,question,answer,img.dbData,img.aiData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn:async () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add=async (text,isInitial)=>
  {
   if(!isInitial) setQuestion(text);
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length?[img.aiData,text]:[text]);
    
        // Print text as it comes in.
        let accumulatedText="";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
     accumulatedText+=chunkText;
     setAnswer(accumulatedText);
    } 
    mutation.mutate();
  }catch (err) {
      console.log(err);
    }
  }

  

  const handleSubmit=async (e)=>
  {
    e.preventDefault();
    const text=e.target.text.value;
    if(!text)
      return;
    add(text,false);
  }

  // in production we don't need this
  const hasRun=useRef(false);
useEffect(()=>
{
  if(!hasRun.current){
  if(data?.history?.length===1)
  {
    add(data.history[0].parts[0].text,true);
  }
}
hasRun.current=true;
},[]);

  return (
    <>
    {/* Add new Chat */}
    {
      img.isLoading && <div className=''>Loading...</div>
    }
    {
      img.dbData?.filePath && (
        <IKImage
        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
       path={img.dbData?.filePath}
       width="380"
       transformation={[{width:380}]}
      />
      )
    }
   {question && <div className='message user'>{question}</div>}
   {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
    <div className="endChat" ref={endRef}></div>
    <form onSubmit={handleSubmit} className="newForm" ref={formRef}>
       <Upload setImg={setImg} />
        <input type="file" multiple={false} hidden />
        <input type="next" name='text' placeholder='Ask anything...'/>
        <button>
            <img src="/arrow.png" alt="" />
        </button>
    </form>
   </>
  )
}

export default NewPrompt;