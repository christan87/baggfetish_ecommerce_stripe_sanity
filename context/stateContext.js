import React, { createContext, useContext, useState, useEffect} from 'react';
import { toast } from 'react-hot-toast'; // for popups

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1)

    //keeps track of current product and its index
    let foundProduct;
    let index;

    // Add product to cart funciton
    const onAdd = (product, quantity) => {
        // Check cart for product
        const checkProductInCart = cartItems.find((itme) => itme._id === product._id);
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        // if product in cart increase its quantity
        if(checkProductInCart) {
            /*
                - updatedCartItems maps over each product in cartItems
                - if a product in the cart matches the product provided its quantity
                  is increased 'by' the provided quantity
            */
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems);
        }else{
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartItems);
    }

    // Update cart total price/quantity and products
    const toggleCartQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        //const newCartItems = cartItems.filter((item) => item._id !== id);
        let newCartItems = [...cartItems];
        if(value === 'inc') {
            newCartItems[index] = {...foundProduct, quantity: foundProduct.quantity + 1}
            //setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1}]);
            setCartItems([...newCartItems])
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if(value === 'dec') {
            if(foundProduct.quantity > 1){
                newCartItems[index] = {...foundProduct, quantity: foundProduct.quantity - 1}
                //setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1}]);
                setCartItems([...newCartItems])
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
        }
    }   

    // Increase quantity function
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    // Decrease quantity function
    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    }

    return(
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                showCart,
                setShowCart,
                totalQuantities,
                toggleCartQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities 
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);