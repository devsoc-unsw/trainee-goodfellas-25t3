import { Text } from "react-native"

export const SelectableOption = (props: { key:number, optName:string }) => {
  return (
    <Text className="text-1xl text-white">{props.optName}</Text>
  )
}