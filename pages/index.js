import { useState, useEffect } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';

import { Menu } from '../components/menu';
import { MenuMobile } from '../components/menuMobile';
import { EmpresaSection } from '../components/empresaSection';
import { FormHome } from '../components/homeForm';
import { Footer } from '../components/footer';
import { ServicesHome } from '../components/servicesSection';
import { Parceiros } from '../components/parceirosSection';
import { BlogSection } from '../components/blogSection';

import BannerImage from '../assets/banner-home.jpg';

import styles from '../styles/Home.module.css';

export default function Home({ posts }) {
  console.log(posts)
  const router = useRouter();
  const [ mappedPosts, setMappedPosts ] = useState([]);

  useEffect(() => {
    if(posts.length){
      const imgBuilder = imageUrlBuilder({
        projectId: 'uwk4dif1',
        dataset: 'production',
      });

      setMappedPosts(
        posts.map(p => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(350).height(350),            
          }
        })
      )      
    } else {
      setMappedPosts([]);
    }
  }, [posts])

  return (
    <>
    <Head>
      <title>Carvalhaço Reciclagem</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
      <Menu />
      <MenuMobile />
      <div className={styles.banner}>
        <Image className={styles.bannerImg} src={BannerImage} />
      </div>
      <div className={styles.bannerMobile}>
      <Image className={styles.bannerImgMobile} src={BannerImage} />
      </div>
      <EmpresaSection />
      <FormHome />
      <ServicesHome />
      <div className={styles.blog}>
        <div className={styles.blogContent}>
          <h2>Nossas postagens</h2>
          <div className={styles.feed}>
            {mappedPosts.length ? mappedPosts.slice( 1, 4 ).map((p, index) => (
              <div onClick={() => router.push(`/post/${p.slug.current}`)} key={p.title} className={styles.post}>              
                <img src={p.mainImage} className={styles.mainImage} />
                <div className={styles.cardTxt}>
                  <h3>{p.title}</h3>
                  <p>{p.desc.length > 150 ? p.desc.substr(0, 150) + "..." : p.desc}</p>
                  <span className={styles.postDate}>{new Date(p.publishedAt).toLocaleDateString()}</span>
                  <div className={styles.cardBottom}>                  
                    <span>{p.catego}</span>
                    <span>{p.author.substr(0, 20) + "..."}</span>
                  </div>
                </div>
              </div>
            )) : <>No Posts Yet</>}
          </div>
        <Link href="/blog">
          <a className={styles.blogButton}>
            <button>Veja todos as publicações</button>
          </a>
        </Link>
        </div>
      </div>
      <Parceiros />
      <Footer />
    </>
  )
};

export const getServerSideProps = async pageContext => {
  const query = encodeURIComponent('*[ _type == "post"]');
  const url = `https://uwk4dif1.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then(res => res.json());
  if (!result.result || !result.result.length){
    return {
      props: {
        posts: [],
      }
    }
  } else {
    return {
      props: {
        posts: result.result,
      }
    }
  }
};