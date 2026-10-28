import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Tea = {
  id: string;
  name: string;
  price: string;
  amount: string;
  tried: boolean;
};

const STORAGE_KEY = "module7_teas";

export default function App() {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "tried" | "notTried">("all");

  useEffect(() => {
    const loadTeas = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setTeas(JSON.parse(saved));
      } catch (error) {
        Alert.alert("Error", "Unable to load saved tasks.");
      } finally {
        setLoaded(true);
      }
    };
    loadTeas();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const saveTeas = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(teas));
      } catch (error) {
        Alert.alert("Error", "Unable to save tasks.");
      }
    };
    saveTeas();
  }, [teas, loaded]);

  const addTea = () => {
    const name = nameInput.trim();
    const price = priceInput.trim();
    const amount = amountInput.trim();
    if (!name || !price || !amount) {
      Alert.alert("Please fill out all information.");
      return;
    }
    const newTea: Tea = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      price,
      amount,
      tried: false,
    };
    setTeas((current) => [...current, newTea]);
    setNameInput("");
    setPriceInput("");
    setAmountInput("");
  };

  const filterTeas = (filterType: "all" | "tried" | "notTried") => {
    setFilter(filterType);
  };

  const filteredTeas = teas.filter((tea) => {
    if (filter === "tried") return tea.tried;
    if (filter === "notTried") return !tea.tried;
    return true;
  });

  const toggleTried = (id: string) => {
    setTeas((current) =>
      current.map((tea) =>
        tea.id === id ? { ...tea, tried: !tea.tried } : tea
      )
    );
  };

  const deleteTea = (id: string) => {
    setTeas((current) => current.filter((tea) => tea.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Teas</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tea name"
        value={nameInput}
        onChangeText={setNameInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter tea price"
        value={priceInput}
        onChangeText={setPriceInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter tea amount"
        value={amountInput}
        onChangeText={setAmountInput}
      />
      <Button title="Add Tea" onPress={addTea} />
      <View style={styles.buttonContainer}>
        <Button
          color="purple"
          title="All Teas"
          onPress={() => filterTeas("all")}
        />
        <Button
          color="gray"
          title="Teas to Try"
          onPress={() => filterTeas("notTried")}
        />
        <Button
          color="green"
          title="Teas I've Tried"
          onPress={() => filterTeas("tried")}
        />
      </View>
      <FlatList
        data={filteredTeas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.teaRow}>
            <TouchableOpacity
              style={styles.teaText}
              onPress={() => toggleTried(item.id)}
            >
              <Text style={item.tried ? styles.tried : styles.normal}>
                {item.tried ? "✓ " : "○ "}
                {item.name}
              </Text>
            </TouchableOpacity>
            <View style={styles.teaInfo}>
              <Text>{item.price}</Text>
              <Text>{item.amount}</Text>
            </View>
            <Button
              title="Delete"
              color="red"
              onPress={() => deleteTea(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 70,
    backgroundColor: "#f4f4f4",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    padding: 20,
    paddingHorizontal: 50,
    flexDirection: "column",
    gap: 10,
  },
  teaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 8,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
  teaInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    marginRight: 10,
  },
  teaText: {
    flex: 1,
  },
  normal: {
    fontSize: 16,
  },
  tried: {
    fontSize: 16,
    textDecorationLine: "underline",
    color: "green",
  },
});
