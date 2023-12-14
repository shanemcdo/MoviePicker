import { Accessor, Setter } from 'solid-js'

export interface TimerObject {
    id: number
    name: Accessor<string>
    setName: Setter<string>
    remove: () => void
}