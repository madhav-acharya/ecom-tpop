import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import '../styles/AnimatedList.css';
import { setSelectedCategory } from '../app/features/search/searchSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.search.selectedCategory);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: '1rem', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
    items = [],
    catstate,
    onItemSelect,
    enableArrowNavigation = false,
    className = '',
    itemClassName = '',
    displayScrollbar = false,
    initialSelectedIndex = -1,
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const setShowCategories = catstate;

  // const handleScroll = (e) => {
  //   const { scrollTop, scrollHeight, clientHeight } = e.target;
  //   setTopGradientOpacity(Math.min(scrollTop / 50, 1));
  //   const bottomDistance = scrollHeight - (scrollTop + clientHeight);
  //   setBottomGradientOpacity(
  //     scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
  //   );
  // };

  // Keyboard navigation: arrow keys, tab, and enter selection
  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  // Scroll the selected item into view if needed
  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth',
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);
  const navigate = useNavigate();

  return (
    <div className="animated-list">
    <div className={`scroll-list-container ${className}`}>
      <div
        ref={listRef}
        className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`}
        // onScroll={handleScroll}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              navigate("/search-result");
              if (onItemSelect) {
                onItemSelect(item, index);
              }
            }}
          >
            <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`} onClick={()=>setShowCategories(false)}>
              <p className="item-text">{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </div>
    </div>
  );
};

export default AnimatedList;
