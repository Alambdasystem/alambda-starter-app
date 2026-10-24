import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

type Task = { id: string; title: string; done: boolean };
const KEY = 'alambda.checklist.v1';
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState('');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function load() {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const value = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(value) || value.some(t => typeof t.id !== 'string' || typeof t.title !== 'string' || typeof t.done !== 'boolean')) throw new Error('Invalid saved data');
      setError(''); setTasks(value); setReady(true);
    } catch { setError('Your checklist could not be loaded. Tap Retry to try again.'); }
  }
  // State updates follow the asynchronous device-storage read.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);
  async function save(next: Task[]) {
    if (!ready || saving) return false;
    setSaving(true); setError('');
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); setTasks(next); return true; }
    catch { setError('Changes could not be saved. Please try again.'); return false; }
    finally { setSaving(false); }
  }
  async function add() {
    const title = draft.trim();
    if (!title) return;
    if (await save([...tasks, {id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, done:false}])) setDraft('');
  }
  const completed = tasks.filter(t => t.done).length;
  return <SafeAreaView style={s.safe}><StatusBar style="light"/><KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Text style={s.brand}>ARCHTEK AI · ALAMBDA SYSTEMS</Text><Text style={s.title}>Make room for{ '\n' }what matters.</Text>
    <Text style={s.subtitle}>Your day, one check at a time.</Text>
    <View style={s.summary}><Text style={s.summaryText}>{completed} of {tasks.length} complete</Text><Text style={s.badge}>CHECKLIST</Text></View>
    <View style={s.entry}><TextInput accessibilityLabel="New task" placeholder="What needs doing?" placeholderTextColor="#94a3b8" value={draft} onChangeText={setDraft} maxLength={200} style={s.input} onSubmitEditing={add} editable={ready && !saving} returnKeyType="done"/><Pressable accessibilityRole="button" accessibilityLabel="Add task" disabled={!ready || saving || !draft.trim()} onPress={add} style={[s.add, (!ready || saving || !draft.trim()) && s.disabled]}><Text style={s.addText}>Add</Text></Pressable></View>
    {!!error && <View><Text accessibilityRole="alert" style={s.error}>{error}</Text>{!ready && <Pressable accessibilityRole="button" onPress={load}><Text style={s.retry}>Retry</Text></Pressable>}</View>}
    <FlatList data={tasks} keyExtractor={t=>t.id} contentContainerStyle={s.list} ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTitle}>{ready ? 'A fresh start.' : 'Loading your checklist…'}</Text><Text style={s.subtitle}>Add your first task above.</Text></View>} renderItem={({item})=><View style={s.row}><Pressable style={s.task} accessibilityRole="checkbox" accessibilityState={{checked:item.done, disabled:saving}} accessibilityLabel={item.title} disabled={saving} onPress={()=>save(tasks.map(t=>t.id===item.id ? {...t,done:!t.done}:t))}><View style={[s.check,item.done && s.checked]}><Text style={s.tick}>{item.done?'✓':''}</Text></View><Text style={[s.taskText,item.done && s.done]}>{item.title}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Delete ${item.title}`} disabled={saving} onPress={()=>Alert.alert('Delete task?', item.title,[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{void save(tasks.filter(t=>t.id!==item.id));}}])}><Text style={s.delete}>×</Text></Pressable></View>}/>
    <Text style={s.footer}>Saved on this device · No account needed</Text><Text style={s.version}>Alambda Checklist 1.0.0</Text>
  </KeyboardAvoidingView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#101827'},page:{flex:1,padding:24,paddingTop:32},brand:{color:'#6ee7b7',fontSize:11,fontWeight:'700',letterSpacing:1.8},title:{color:'#f8fafc',fontSize:37,fontWeight:'700',marginTop:24,lineHeight:44},subtitle:{color:'#a1afc4',fontSize:15,marginTop:10},summary:{marginTop:30,marginBottom:18,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},summaryText:{color:'#e2e8f0',fontSize:15},badge:{color:'#6ee7b7',fontSize:10,letterSpacing:1.4},entry:{flexDirection:'row',gap:10},input:{flex:1,backgroundColor:'#1e293b',borderRadius:14,padding:16,color:'white',fontSize:16},add:{backgroundColor:'#6ee7b7',borderRadius:14,paddingHorizontal:20,justifyContent:'center',minHeight:52},addText:{color:'#10251f',fontWeight:'700',fontSize:16},disabled:{opacity:0.4},list:{paddingTop:20,paddingBottom:24},row:{flexDirection:'row',alignItems:'center',backgroundColor:'#192437',padding:16,borderRadius:14,marginBottom:10,gap:12},task:{flex:1,flexDirection:'row',alignItems:'center',gap:14,minHeight:32},check:{width:26,height:26,borderRadius:8,borderWidth:2,borderColor:'#62738c',alignItems:'center',justifyContent:'center'},checked:{backgroundColor:'#6ee7b7',borderColor:'#6ee7b7'},tick:{fontWeight:'800',color:'#10251f'},taskText:{color:'#f1f5f9',fontSize:16,flex:1},done:{textDecorationLine:'line-through',color:'#8191aa'},delete:{color:'#a1afc4',fontSize:28,paddingHorizontal:8},empty:{paddingVertical:44,alignItems:'center'},emptyTitle:{fontSize:22,color:'#e2e8f0',fontWeight:'600'},footer:{color:'#8fa2bd',fontSize:12,textAlign:'center'},version:{color:'#61738e',fontSize:11,textAlign:'center',marginTop:8,marginBottom:12},error:{color:'#fca5a5',marginTop:12},retry:{color:'#6ee7b7',paddingVertical:12}});
