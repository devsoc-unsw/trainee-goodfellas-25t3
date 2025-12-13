import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase'
import { useSession } from '../../contexts/SessionContext';
import { Habit } from '../../types/habit'
import Dropdown from 'react-native-input-select';

// used for the dropdown to select a habit in goals menu

export const SelectHabit = (props: {setSelected:(habitId:number)=>void}) => {
  const { session } = useSession();
  const [ dropdownOpts, setDropdownOpts ] = useState<{label:string; value:number;}[]>([]);
  const [ selectedOpt, setSelected ] = useState<number>();
  const [ error, setError ] = useState<string | null>(null);

  async function fetchHabits() {
    if (!session?.user) {
      setError('Must be logged in to fetch habits.');
      return;
    }

    setError(null);

    const { data, error } = await supabase
      .from('habits')
      .select('*');

    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      setDropdownOpts(data.map((e:Habit) => { return {label: e.name, value: e.id} }));
    }
  }

  // FIXME: need to rerender options when habits are updated as well
  useEffect(() => {
    fetchHabits();
  }, [])

  return (
    <>
      <Dropdown
        // FIXME: this doesn't render right D:
        placeholder='Select a habit...'
        options={dropdownOpts}
        selectedValue={selectedOpt}
        onValueChange={(value) => {
          setSelected(value as number);
          props.setSelected(value as number);
        }}
        primaryColor={'blue'}
        placeholderStyle={{color:'#888', fontSize:18, fontWeight: 300}}
        selectedItemStyle={{color:'white', fontSize:18, fontWeight: 300}}
        dropdownContainerStyle={{borderColor:'#404040', backgroundColor:'#404040'}}
      />
    </>
  )
}