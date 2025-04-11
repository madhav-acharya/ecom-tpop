import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Product from '../components/Product';
import Carousel from '../components/Carousel';
import { useGetProductsQuery } from '../app/api/productAPI';

const Home = () => {
  const  {data}  = useGetProductsQuery();
  return (
    <div className="home">
        <Header />
        <div className="content">
            <Carousel />
            <Product tagName={"New Arrival"} productList={data}/>
        </div>
        <Footer />
    </div>
  )
}

export default Home