import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';

interface InfoCard {
  id: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  formula?: string;
}

const InfoCards: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { t } = useLanguage();

  const infoCards: InfoCard[] = [
    {
      id: 'constructive',
      title: 'Yapıcı Girişim',
      titleEn: 'Constructive Interference',
      content:
        'İki dalga aynı fazda olduğunda birbirlerini güçlendirerek daha büyük genlikli bir dalga oluştururlar.',
      contentEn:
        'When two waves are in phase, they reinforce each other creating a wave with larger amplitude.',
      icon: '💡',
      level: 'beginner',
      formula: 'y_total = A₁ + A₂',
    },
    {
      id: 'destructive',
      title: 'Yıkıcı Girişim',
      titleEn: 'Destructive Interference',
      content:
        'İki dalga ters fazda olduğunda birbirlerini zayıflatır veya tamamen yok ederler.',
      contentEn:
        'When two waves are out of phase, they weaken each other or cancel completely.',
      icon: '⚡',
      level: 'beginner',
      formula: 'y_total = A₁ - A₂',
    },
    {
      id: 'phase-difference',
      title: 'Faz Farkının Etkisi',
      titleEn: 'Effect of Phase Difference',
      content:
        'İki dalga arasındaki faz farkı girişim desenini belirler. Faz farkı 0° ise yapıcı, 180° ise yıkıcı girişim oluşur.',
      contentEn:
        'Phase difference between waves determines interference pattern. 0° creates constructive, 180° creates destructive interference.',
      icon: '🌊',
      level: 'intermediate',
      formula: 'Δφ = 2π(d₂ - d₁)/λ',
    },
    {
      id: 'superposition',
      title: 'Süperpozisyon İlkesi',
      titleEn: 'Superposition Principle',
      content:
        'İki veya daha fazla dalga aynı ortamda buluştuğunda, toplam yer değiştirme her dalganın toplamına eşittir.',
      contentEn:
        'When two or more waves meet, the total displacement equals the sum of displacements of each wave.',
      icon: '🎯',
      level: 'advanced',
      formula: 'y_total = y₁ + y₂ + y₃ + ...',
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: 'rgba(34, 197, 94, 0.5)',
          textColor: '#22c55e',
        };
      case 'intermediate':
        return {
          backgroundColor: 'rgba(234, 179, 8, 0.2)',
          borderColor: 'rgba(234, 179, 8, 0.5)',
          textColor: '#eab308',
        };
      case 'advanced':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgba(239, 68, 68, 0.5)',
          textColor: '#ef4444',
        };
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.2)',
          borderColor: 'rgba(107, 114, 128, 0.5)',
          textColor: '#6b7280',
        };
    }
  };

  const toggleCard = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          📚 {t('Eğitici İçerik', 'Educational Content')}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {infoCards.map((card) => {
          const isSelected = selectedCard === card.id;
          const levelStyle = getLevelColor(card.level);

          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.infoCard, isSelected && styles.selectedCard]}
              onPress={() => toggleCard(card.id)}
            >
              {/* Compact Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
                <Text style={styles.cardTitle}>
                  {t(card.title, card.titleEn)}
                </Text>
                <View style={[styles.levelBadge, levelStyle]}>
                  <Text
                    style={[styles.levelText, { color: levelStyle.textColor }]}
                  >
                    {t(
                      card.level === 'beginner'
                        ? 'Başlangıç'
                        : card.level === 'intermediate'
                        ? 'Orta'
                        : 'İleri',
                      card.level
                    )}
                  </Text>
                </View>
                <Text style={styles.expandIcon}>{isSelected ? '▼' : '▶'}</Text>
              </View>

              {/* Expanded Content */}
              {isSelected && (
                <View style={styles.expandedContent}>
                  <Text style={styles.cardContent}>
                    {t(card.content, card.contentEn)}
                  </Text>

                  {card.formula && (
                    <View style={styles.formulaContainer}>
                      <Text style={styles.formulaLabel}>
                        {t('Formül:', 'Formula:')}
                      </Text>
                      <View style={styles.formulaBox}>
                        <Text style={styles.formulaText}>{card.formula}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Compact Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipText}>
          💡{' '}
          {t(
            'Dalga kaynaklarını hareket ettirerek farklı girişim desenleri oluşturun!',
            'Move wave sources to create different interference patterns!'
          )}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  cardsContainer: {
    gap: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  selectedCard: {
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f1f5f9',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: 'bold',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  cardContent: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 16,
    marginBottom: 8,
  },
  formulaContainer: {
    marginTop: 8,
  },
  formulaLabel: {
    fontSize: 11,
    color: '#06b6d4',
    fontWeight: '600',
    marginBottom: 4,
  },
  formulaBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  formulaText: {
    fontSize: 10,
    color: '#22c55e',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderColor: 'rgba(147, 51, 234, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  tipText: {
    fontSize: 11,
    color: '#a855f7',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default InfoCards;
