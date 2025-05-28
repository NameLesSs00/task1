class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  phoneNumber?: string;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(name: string, phoneNumber: string) {
    let node = this.root;
    for (const char of name.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
    node.phoneNumber = phoneNumber;
  }

  // Returns list of names that start with prefix
  searchPrefix(prefix: string): string[] {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) return [];
      node = node.children.get(char)!;
    }
    return this.collectAllWords(node, prefix.toLowerCase());
  }

  // Helper to collect all names under node
  private collectAllWords(node: TrieNode, prefix: string): string[] {
    let results: string[] = [];
    if (node.isEndOfWord) results.push(prefix);
    for (const [char, childNode] of node.children) {
      results = results.concat(this.collectAllWords(childNode, prefix + char));
    }
    return results;
  }

  // Get phone number for a full name
  getPhoneNumber(name: string): string | undefined {
    let node = this.root;
    for (const char of name.toLowerCase()) {
      if (!node.children.has(char)) return undefined;
      node = node.children.get(char)!;
    }
    return node.isEndOfWord ? node.phoneNumber : undefined;
  }
}
