import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface FormulaTextProps {
  formula: string;
  style?: any;
  description?: string;
  descriptionStyle?: any;
}

export default function FormulaText({ formula, style, description, descriptionStyle }: FormulaTextProps) {
  // Alt indis ve üst indisleri parse et ve render et
  const parseFormula = (text: string) => {
    const parts = [];
    let currentIndex = 0;
    
    // Alt indis ve üst indis pattern'larını bul
    // _kelime: alt indis, ^kelime: üst indis
    const pattern = /(_|\^)([a-zA-ZğüşıöçĞÜŞIÖÇ0-9]+)/g;
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      // Normal metin kısmını ekle
      if (match.index > currentIndex) {
        parts.push({
          type: 'normal',
          text: text.substring(currentIndex, match.index)
        });
      }
      
      // Alt indis veya üst indis kısmını ekle
      parts.push({
        type: match[1] === '_' ? 'subscript' : 'superscript',
        text: match[2]
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    // Kalan normal metni ekle
    if (currentIndex < text.length) {
      parts.push({
        type: 'normal',
        text: text.substring(currentIndex)
      });
    }
    
    return parts;
  };

  const formulaParts = parseFormula(formula);

  return (
    <View style={styles.container}>
      <View style={styles.formulaContainer}>
        {formulaParts.map((part, index) => (
          <Text
            key={index}
            style={[
              styles.formulaText,
              style,
              part.type === 'subscript' && styles.subscript,
              part.type === 'superscript' && styles.superscript
            ]}
          >
            {part.text}
          </Text>
        ))}
      </View>
      {description && (
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formulaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  formulaText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  subscript: {
    fontSize: 14,
    transform: [{ translateY: 6 }], // Alt indis için aşağı kaydır
  },
  superscript: {
    fontSize: 14,
    transform: [{ translateY: -6 }], // Üst indis için yukarı kaydır
  },
  description: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
}); 