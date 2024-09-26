import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db.ts"
import type { Guitar, CartItem, GuitarID } from "../types"

const useCart = () => {

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1
    
    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
    
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]) 

      const addToCart = (item: Guitar) => {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExists >= 0){
          const updatedCart = [...cart]
          updatedCart[itemExists].quantity++
          setCart(updatedCart)
        } else {
          const newItem : CartItem = {...item, quantity : 1}
          setCart([...cart, newItem])
        }
      }
      const removeFromCart = (id : GuitarID) => {
        setCart(prevCart => prevCart.filter( guitar => guitar.id !== id))
      }
    
      const increaseQuantity = (id : GuitarID) => {
        const updatedCart = cart.map( item => {
          if(item.id === id && item.quantity < MAX_ITEMS){
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      const decreaseQuantity = (id : GuitarID) => {
        const updatedCart = cart.map( item => {
          if(item.id === id && item.quantity > MIN_ITEMS){
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      const clearCart = () => {
        setCart([])
      }
      
      useEffect( () => {
        localStorage.setItem('cart', JSON.stringify(cart))
      }, [cart])
    
    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

export default useCart