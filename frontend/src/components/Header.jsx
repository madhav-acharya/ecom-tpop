import React, {useState, useEffect} from 'react';
import '../styles/Header.css';
import { AiOutlineUser } from "react-icons/ai";
import { GrSearch } from "react-icons/gr";
import { FaAngleDown } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { TbSmartHome } from "react-icons/tb";
import { IoStorefrontOutline } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { GoHeart } from "react-icons/go";
import { IoMenu } from "react-icons/io5";
import Drawer from '@mui/material/Drawer';
import AnimatedList from './AnimatedList';
import { FaAngleUp } from "react-icons/fa6";
import Divider from '@mui/material/Divider';
import { MdDelete } from "react-icons/md";
import { selectCartItems, selectCartTotal, selectCartItemCount } from '../app/features/cart/cartSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../app/api/cartAPI';
import Badge from '@mui/material/Badge';
import ProfileMenu from './ProfileMenu';
import { useGetCategoriesQuery } from '../app/api/categoryAPI';
import { useGetCurrentUserQuery } from '../app/api/authAPI';
import { setSearchTerm } from '../app/features/search/searchSlice';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function Header() {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const searchTerm = useSelector((state) => state.search.searchTerm);
    const dispatch = useDispatch();
    const [showCategories, setShowCategories] = useState(false);
    const carts = useSelector(selectCartItems);
    const user = useGetCurrentUserQuery(undefined, { skip: isAuthPage });
    const cartTotal = useSelector(selectCartTotal);
    const cartCount = useSelector(selectCartItemCount);
    const [showCart, setShowCart] = useState(false);
    const categories = useGetCategoriesQuery();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    useEffect(() => {
        if (carts?.status === 'idle' && !isAuthPage) {
            dispatch(fetchCart());
        }
        if (carts?.status === 'failed') {
            console.log("status failed",carts?.error)
          }
    }, [dispatch, carts]);

    useEffect(() => {
        if (user?.isSuccess === false && !isAuthPage) {
            dispatch(fetchCart());
        }
    }, [dispatch, user]);

    const items = categories?.data?.map((category) => category?.name);
  return (
    <header className="header">
        <Drawer anchor='left' open={open} onClose={toggleDrawer(false)} className='drawer'>
        {!localStorage.getItem('token')?
            <div className="user" onClick={toggleDrawer(false)}>
                    <i className='user-icon'><AiOutlineUser/></i>
                <Link to="/login" className='login'>
                    <span className='login'>Login</span>
                </Link>
                <span>|</span>
                <Link to="/signup" className='register'>
                    <span className='register'>Register</span>
                </Link>
            </div>:
            <div className="user">
                <ProfileMenu/>
                {`Welcome, ${(user?.data?.user?.firstName)? user?.data?.user?.firstName: "Guest"}`}
            </div>}
        </Drawer>

        <div className="upper-nav">
            <div className="logo">
                <Link to="/" className="logo-link">
                    {/* <img src="./logo.webp" alt="logo" /> */}TPOP
                </Link>
            </div>
            <div className="search-bar">
                <i className='menu-icon' onClick={toggleDrawer(true)}><IoMenu/></i>
                <input type="search" value={searchTerm} id='search-bar' placeholder='i am shopping for...' onChange={(e)=>dispatch(setSearchTerm(e.target.value))}/>
                <i className='search-icon' onClick={()=>navigate("/search-result")}><GrSearch/></i>
            </div>
            <i className="mobile-wishlist mobile-navs">
                <Link to="/wishlist" className='mobile-wishlist-link a heart-icon'>
                    <GoHeart/>
                    <span>Wishlist</span>
                </Link>
            </i>
            {!localStorage.getItem('token')?
            <div className="user">
                <i className='user-icon'><AiOutlineUser/></i>
                <Link to="/login" className='login'>
                    <span className='login'>Login</span>
                </Link>
                <span>|</span>
                <Link to="/signup" className='register'>
                    <span className='register'>Register</span>
                </Link>
            </div>:
            <div className="user">
                <ProfileMenu/>
                {`Welcome, ${(user?.data?.user?.firstName)? user?.data?.user?.firstName: "Guest"}`}
            </div>}
        </div>
        <div className="full-lower-nav">
            <div className="lower-nav">
                <div className="categories" onClick={()=>{showCategories?setShowCategories(false):setShowCategories(true);}}>
                    <div className="cat-cat">
                        <span>Categories (See All)</span>
                        <i className='dropdown-icon'>{showCategories?<FaAngleDown/>:<FaAngleUp/>}</i>
                        <div className="categories-overlay">
                            {showCategories&&<AnimatedList
                            items={items}
                            catstate={setShowCategories}
                            onItemSelect={(item, index) => console.log(item, index)}
                            displayScrollbar={false}
                            className='al'
                            onClick={()=>setShowCategories(false)}
                            />}
                        </div>
                    </div>
                </div>
                <div className="cart" onClick={()=>{showCart?setShowCart(false):setShowCart(true);}}>
                    <div className="cart-items-show">
                        <i className='cart-icon'><Badge color='success' badgeContent={cartCount} max={9}><FaCartShopping/></Badge></i>
                        <span>{`Rs ${cartTotal}`}</span>
                    </div>
                    {showCart&&
                    <div className="cart-overlay">
                        <div className="tag-name">
                            Cart Items
                        </div>
                        <Divider/>
                        <div className="cart-scroll">
                        {carts?.cartItems?.length>0?carts?.cartItems?.map((cart)=>(
                        <div className="added-cart-item" key={cart?._id}>
                            <div className="added-cart-image">
                                <img src={cart?.image} alt="product" />
                            </div>
                            <div className="added-cart-content">
                                <div className="cart-name-price">
                                    <span className="added-cart-name">
                                        {cart?.name}
                                    </span> 
                                    <span className="added-cart-price-quantity">
                                        {`Rs: ${cart?.price} x ${cart?.quantity}`}
                                    </span>
                                </div>
                            </div>
                            
                        </div>)):<p className='tag-name'>No Cart Items added</p>}
                        </div>
                        {carts?.cartItems?.length>0?
                        <>
                        <Divider/>
                        <div className="cart-total">
                            <span className="added-cart-price-quantity">
                                Subtotal
                            </span>
                            <span className='sub-total'>{`RS: ${cartTotal}`}</span>
                        </div>
                        <Divider/>
                        <Link to="/cart"><button className="view-cart-btn">
                            View Cart
                        </button></Link>
                        </>: <Link to="/product"><button className="view-cart-btn">
                            Shop Now
                        </button></Link>}
                    </div>}
                </div>
            </div>
        </div>
        <div className="mobile-nav">
            <i className="mobile-home">
                <Link to="/" className='home-link a'>
                    <TbSmartHome/>
                    <span>Home</span>
                </Link>
            </i>
            <i className="mobile-store">
                <Link to="/store" className='store-link a'>
                    <IoStorefrontOutline/>
                    <span>Store</span>
                </Link>
            </i>
            <i className="mobile-cart" >
                <Link to="/cart" className='mobile-cart-link a'>
                    <HiOutlineShoppingCart/>
                </Link>
            </i>
            <i className="mobile-wishlist">
                <Link to="/wishlist" className='mobile-wishlist-link a'>
                    <GoHeart/>
                    <span>Wishlist</span>
                </Link>
            </i>
            <i className="mobile-user">
                <Link to="/login" className='mobile-login-link a'>
                    <AiOutlineUser/>
                    <span>Account</span>
                </Link>
            </i>
        </div>
    </header>
  )
}

export default Header