import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useOrders({ userId = null, roleFilter = null } = {}) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true)
            let query = supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false }) // Sort by created_at since slots are arrays

            // Accountant only sees their own orders
            if (roleFilter === 'accountant' && userId) {
                query = query.eq('created_by', userId)
            }

            const { data, error: fetchError } = await query

            if (fetchError) {
                alert(`Supabase fetch error: ${fetchError.message || JSON.stringify(fetchError)}`);
                throw fetchError;
            }
            setOrders(data || [])
        } catch (err) {
            console.error('Error fetching orders:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [userId, roleFilter])

    useEffect(() => {
        fetchOrders()

        // Subscribe to realtime changes
        const channel = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setOrders(prev => [payload.new, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders(prev =>
                            prev.map(order =>
                                order.id === payload.new.id ? payload.new : order
                            )
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setOrders(prev =>
                            prev.filter(order => order.id !== payload.old.id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchOrders])

    // Create order
    async function createOrder(orderData) {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])

        if (error) throw error
        return data
    }

    // Update order
    async function updateOrder(id, updates) {
        const { data, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    // Delete order
    async function deleteOrder(id) {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    // Mark as packed
    async function markPacked(id) {
        return updateOrder(id, { order_status: 'packed' })
    }

    // Mark as delivered
    async function markDelivered(id) {
        return updateOrder(id, { order_status: 'delivered' })
    }

    // Mark payment received
    async function markPaid(id) {
        return updateOrder(id, { payment_status: 'paid' })
    }

    return {
        orders,
        loading,
        error,
        refetch: fetchOrders,
        createOrder,
        updateOrder,
        deleteOrder,
        markPacked,
        markDelivered,
        markPaid
    }
}
