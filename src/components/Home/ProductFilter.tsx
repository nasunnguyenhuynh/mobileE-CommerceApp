import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import api, { endpoints } from '../../utils/api';
import AntDesign from "react-native-vector-icons/AntDesign"
import { Category } from '../../interfaces/category';

interface ProductFilterProps {
    visible: boolean;
    toggleModal: () => void;
    onApplyFilters: (appliedFilter: any | null) => void;
}

const ProductFilter = ({ visible, toggleModal, onApplyFilters }: ProductFilterProps) => {
    if (!visible) return null;

    const [sortOrder, setSortOrder] = useState(null); // null, 'oni', or 'ond'
    const handleSortOrder = (order: any) => {
        setSortOrder(prevOrder => (prevOrder === order ? null : order));
    };

    const [priceOrder, setPriceOrder] = useState(null); // null, 'opi', or 'opd'
    const handlePriceOrder = (order: any) => {
        setPriceOrder(prevOrder => (prevOrder === order ? null : order));
    };
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');
    const [error, setError] = useState('');

    const handleApplyFilters = () => {
        if (Number(min) > Number(max)) {
            setError("min price must be less than max price");
        } else if (!sortOrder && !priceOrder && !selectedCategory && !min && !max) {
            toggleModal();
        } else {
            onApplyFilters({ sortOrder, priceOrder, selectedCategory, min, max });
            toggleModal();
        }
    };
    // Categories
    const [categories, setCategories] = useState<Category[]>([])
    const fetchCategories = async () => {
        try {
            const response = await api.get(endpoints.categories);
            if (response.status === 200 && response.data) {
                setCategories(response.data);

            }
        } catch (error) {
            console.error('Categories not found', error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const toggleCategory = (categoryId: number) => {
        if (selectedCategory?.id === categoryId) {
            setSelectedCategory(null);
        } else {
            const category = categories.find(cat => cat.id === categoryId);
            setSelectedCategory(category || null);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                        <AntDesign name="close" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={styles.filterHeader}>
                        <Text style={styles.filterHeaderText}>Filter Search</Text>
                    </View>
                    <ScrollView style={styles.scrollViewContent}>
                        {/* Categories */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Categories</Text>
                            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                                {
                                    categories?.map(cat => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            onPress={() => toggleCategory(cat.id)}
                                            style={{
                                                width: "47%",
                                                marginHorizontal: 4,
                                                marginBottom: 8,
                                                paddingVertical: 4,
                                                paddingHorizontal: 6,
                                                backgroundColor: selectedCategory?.id === cat.id ? "tomato" : "powderblue",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderRadius: 4,
                                            }}
                                        >
                                            <Text style={{ flex: 1, flexWrap: 'wrap', color: selectedCategory?.id === cat.id ? "white" : "black" }}>
                                                {cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </View>
                        {/* Prices */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Prices</Text>
                            <View style={styles.priceButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.priceButton,
                                        priceOrder === 'opi' && styles.selectedButton
                                    ]}
                                    onPress={() => handlePriceOrder('opi')}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        priceOrder === 'opi' && styles.selectedButtonText
                                    ]}>Increase</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.priceButton,
                                        priceOrder === 'opd' && styles.selectedButton
                                    ]}
                                    onPress={() => handlePriceOrder('opd')}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        priceOrder === 'opd' && styles.selectedButtonText
                                    ]}>Decrease</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.priceRange}>
                                <View style={styles.priceInput}>
                                    <TextInput placeholder="MIN"
                                        style={styles.priceInputText}
                                        onChangeText={setMin}
                                        value={min}
                                    ></TextInput>
                                </View>
                                <Text style={styles.priceSeparator}>-</Text>
                                <View style={styles.priceInput}>
                                    <TextInput placeholder="MAX"
                                        style={styles.priceInputText}
                                        onChangeText={setMax}
                                        value={max}
                                    ></TextInput>
                                </View>
                            </View>
                        </View>
                        {/* Order */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Name</Text>
                            <View style={styles.nameButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.nameButton,
                                        sortOrder === 'oni' && styles.selectedButton
                                    ]}
                                    onPress={() => handleSortOrder('oni')}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        sortOrder === 'oni' && styles.selectedButtonText
                                    ]}>A - Z</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.nameButton,
                                        sortOrder === 'ond' && styles.selectedButton
                                    ]}
                                    onPress={() => handleSortOrder('ond')}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        sortOrder === 'ond' && styles.selectedButtonText
                                    ]}>Z - A</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}
                    <View style={styles.applyButtonContainer}>
                        <TouchableOpacity style={styles.applyButton}
                            onPress={handleApplyFilters}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ProductFilter

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContainer: {
        backgroundColor: "#f5f5f5",
        padding: 15,
        width: "90%",
        height: "60%",
        borderRadius: 10,
    },
    closeButton: {
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 1,
        flexDirection: "row"
    },
    filterHeader: {
        alignItems: "center",
        marginBottom: 20
    },
    filterHeaderText: {
        fontSize: 14,
        fontWeight: "500"
    },
    scrollViewContent: {
        marginTop: 40, // Adjust as needed to fit the header properly
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    priceButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    priceButton: {
        width: "48%",
        paddingVertical: 4,
        paddingHorizontal: 6,
        backgroundColor: "powderblue",
        justifyContent: "center",
        alignItems: "center",
    },
    priceRange: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 6,
        backgroundColor: "#eaf7f8",
        borderBottomWidth: 0.2,
        borderColor: "#d3d3d3",
        marginBottom: 10,
    },
    priceInput: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 2,
        paddingHorizontal: 6,
        backgroundColor: "white",
        width: "46%",
        justifyContent: "center",
    },
    priceInputText: {
        flex: 1,
        //color: "#d3d3d3",
    },
    priceSeparator: {
        color: "#d3d3d3",
    },
    nameButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.2,
        borderColor: "#d3d3d3",
        marginBottom: 10,
    },
    nameButton: {
        width: "48%",
        paddingVertical: 4,
        paddingHorizontal: 6,
        backgroundColor: "powderblue",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "transparent"
    },
    selectedButton: {
        borderColor: "tomato"
    },
    buttonText: {
        color: "black"
    },
    selectedButtonText: {
        color: "tomato"
    },
    applyButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-end",
        marginTop: 10
    },
    applyButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "tomato",
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    applyButtonText: {
        fontSize: 18,
        color: "white"
    }
});