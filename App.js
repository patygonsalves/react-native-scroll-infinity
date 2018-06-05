import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const baseURL = 'https://api.github.com';
const searchTerm = 'react';
const perPage = 20;

export default class App extends Component {
  state = {
    data: [],
    page: 1,
    loading: false,
  };

  componentDidMount() {
    this.loadRepositories();
  }

  loadRepositories = async () => {
    if (this.state.loading) return;

    const { page } = this.state;

    this.setState({ loading: true });

    const response = await fetch(`${baseURL}/search/repositories?q=${searchTerm}&per_page=${perPage}&page=${page}`);
    const repositories = await response.json();

    this.setState({
      data: [ ...this.state.data, ...repositories.items ],
      page: page + 1,
      loading: false,
    });
  }

  renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.full_name}</Text>
    </View>
  );

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  };

  render() {
    return (
      <FlatList
        style={{ marginTop: 30 }}
        contentContainerStyle={styles.list}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={this.loadRepositories}
        onEndReachedThreshold={0.1} //define basicamente o percentual de distância do fim que o usuário deve chegar para carregar novos dados, nesse caso, 0.1 significa 10%.
        ListFooterComponent={this.renderFooter} //loading no fim da lista sempre que estivermos realizando o carregamento de novos itens
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
  },
  listItem: {
    backgroundColor: '#EEE',
    marginTop: 20,
    padding: 30,
  },
});