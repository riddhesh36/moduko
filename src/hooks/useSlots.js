import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSlots() {
    const [slots, setSlots] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSlots = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error: fetchError } = await supabase
                .from('slots')
                .select('*')
                .order('created_at', { ascending: true })

            if (fetchError) throw fetchError
            setSlots(data || [])
        } catch (err) {
            console.error('Error fetching slots:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSlots()

        // Subscribe to realtime changes
        const channel = supabase
            .channel('slots-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'slots'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setSlots(prev => [...prev, payload.new].sort(
                            (a, b) => new Date(a.created_at) - new Date(b.created_at)
                        ))
                    } else if (payload.eventType === 'UPDATE') {
                        setSlots(prev =>
                            prev.map(slot =>
                                slot.id === payload.new.id ? payload.new : slot
                            )
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setSlots(prev =>
                            prev.filter(slot => slot.id !== payload.old.id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchSlots])

    // Create slot
    async function createSlot(name, userId) {
        const { data, error } = await supabase
            .from('slots')
            .insert([{ name, is_active: true, created_by: userId }])
            .select()
            .single()

        if (error) throw error
        return data
    }

    // Toggle slot active status
    async function toggleSlotActive(id, currentStatus) {
        const { data, error } = await supabase
            .from('slots')
            .update({ is_active: !currentStatus })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    // Delete slot
    async function deleteSlot(id) {
        const { error } = await supabase
            .from('slots')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    return {
        slots,
        activeSlots: slots.filter(s => s.is_active),
        loading,
        error,
        refetch: fetchSlots,
        createSlot,
        toggleSlotActive,
        deleteSlot
    }
}
