"use client";

import Image from 'next/image';
import { PokemonDetails } from './types';
import { useTransition } from 'react';
import { removeAllyAction } from '@/app/allies/action';
import { toast } from 'sonner';
import { Loader, Swords, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  myAlly: {
    userID: number;
    pokemonId: number;
    details: PokemonDetails;
  };
}




export default function AlliesCard({ myAlly }: Props) {


  const searchParams = useSearchParams();
  const router = useRouter();


  const [pending, startTransition] = useTransition();

  async function handleRemove() {
    startTransition(async () => {
      const res = await removeAllyAction(myAlly.userID, myAlly.pokemonId);
      if (!res) {
        toast.error("something went wrong");
      } else {
        toast.success(`${myAlly.details.name} has been removed`);
      }
    });
  }


  function myChosenHero() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ally", String(myAlly.pokemonId));
    router.replace(`/battle?${params.toString()}`);
  }



  return (
    <>
      <div className='group flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/30 p-8 transition-all duration-300 ease-in hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <h2 className='text-3xl font-extrabold tracking-tight text-white capitalize'>{myAlly.details?.name}</h2>
          <span className='flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400'>
            Level 50
          </span>
        </div>
        <div className='flex items-center mb-3 border border-slate-800 bg-slate-950 p-6 rounded-xl'>
          <Image
            width={100}
            height={100}
            alt='pokemon'
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${myAlly.pokemonId}.png`}
            className='w-24 h-24 animate-pulse mr-5'
          />
          <div className='flex-1 grid grid-cols-2 text-md'>
            <div>
              <span className='text-emerald-500'>HP:</span>{' '}
              <span className='text-white font-bold'>{myAlly?.details?.stats?.[0]?.base_stat}</span>
            </div>
            <div>
              <span className='text-rose-500'>ATK:</span>{' '}
              <span className='text-white font-bold'>{myAlly?.details?.stats?.[1]?.base_stat}</span>
            </div>
            <div>
              <span className='text-sky-500'>DEF:</span>{' '}
              <span className='text-white font-bold'>{myAlly?.details?.stats?.[2]?.base_stat}</span>
            </div>
            <div>
              <span className='text-amber-500'>SPD:</span>{' '}
              <span className='text-white font-bold'>{myAlly?.details?.stats?.[5]?.base_stat}</span>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between gap-4'>

          <div onClick={handleRemove} className='flex flex-col items-center justify-between md:flex-row md:items-center '>
            <button className='w-full md:w-auto bg-red-500/10 text-red-400 px-6 py-3 rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition text-sm font-bold flex justify-center items-center shadow-lg shadow-red-950/70 hover:animate-pulse gap-2'>
              {pending ? <Loader className="animate-spin" /> : <Trash2 />} Remove from Allies
            </button>
          </div>

          <button onClick={myChosenHero} className="flex bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-500 transition duration-300 ease-in shadow-lg shadow-cyan-500/40 cursor-pointer tracking-widest hover:animate-pulse text-sm font-bold gap-2">
            <Swords /> Enter Battle Arena
          </button>

        </div>
      </div>
    </>
  );
}
