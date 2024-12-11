import React from 'react'
import Hero from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { NextPage } from 'next'
import { FAQ } from '@/components/FAQ'
import { Testimonials } from '@/components/Testimonials'

const Home: NextPage =()=> {
  return (
    <div>
      <Hero/>
      <Testimonials/>
      <FAQ/>
    </div>
  )
}

export default Home