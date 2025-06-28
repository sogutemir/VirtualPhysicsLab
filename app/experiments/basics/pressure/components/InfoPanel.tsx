import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageContext';

const InfoPanel: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    'pressure' | 'buoyancy' | 'formulas'
  >('pressure');

  const renderContent = () => {
    switch (activeTab) {
      case 'pressure':
        return (
          <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 14 }}>
              {t(
                'Sıvı basıncı, bir sıvının içine batırılmış bir nesneye, sıvının ağırlığından dolayı uyguladığı kuvvettir.',
                'Fluid pressure is the force exerted by a fluid on an object immersed in it due to the weight of the fluid.'
              )}
            </Text>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                {t('Temel İlkeler:', 'Basic Principles:')}
              </Text>
              <View style={{ paddingLeft: 16 }}>
                <Text style={{ fontSize: 14 }}>
                  • {t('Basınç derinlikle artar', 'Pressure increases with depth')}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • {t('Basınç her yönde eşit etkir', 'Pressure acts equally in all directions')}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • {t('Basınç sıvı yoğunluğuna bağlıdır', 'Pressure depends on fluid density')}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • {t('Basınç kabın şeklinden bağımsızdır', 'Pressure is independent of container shape')}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}
              >
                {t('Uygulamalar:', 'Applications:')}
              </Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {t(
                  'Sıvı basıncını anlamak; barajların, denizaltıların, dalış ekipmanlarının, hidrolik sistemlerin tasarımında ve hatta insan vücudundaki kan basıncını anlamada çok önemlidir.',
                  'Understanding fluid pressure is crucial in designing dams, submarines, diving equipment, hydraulic systems, and even understanding blood pressure in the human body.'
                )}
              </Text>
            </View>
          </View>
        );

      case 'buoyancy':
        return (
          <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 14 }}>
              {t(
                'Kaldırma kuvveti, bir sıvının içine batırılmış bir cisme, cismin ağırlığına karşı uyguladığı yukarı yönlü kuvvettir.',
                'Buoyant force is the upward force exerted by a fluid on an immersed object, opposing the weight of the object.'
              )}
            </Text>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                {t('Arşimet Prensibi:', 'Archimedes Principle:')}
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 14 }}>
                  {t(
                    '"Bir sıvıya tamamen veya kısmen batırılmış bir cisme, cismin yer değiştirdiği sıvının ağırlığına eşit büyüklükte yukarı yönlü bir kuvvet etki eder."',
                    '"An object immersed in a fluid experiences an upward force equal to the weight of the fluid displaced by the object."'
                  )}
                </Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                {t('Cisim Davranışı:', 'Object Behavior:')}
              </Text>
              <View style={{ paddingLeft: 16 }}>
                <Text style={{ fontSize: 14 }}>
                  • {t('Yüzme: cisim yoğunluğu < sıvı yoğunluğu', 'Floating: object density < fluid density')}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • {t('Batma: cisim yoğunluğu > sıvı yoğunluğu', 'Sinking: object density > fluid density')}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • {t('Askıda kalma: yoğunluklar eşit', 'Neutral buoyancy: densities equal')}
                </Text>
              </View>
            </View>
          </View>
        );

      case 'formulas':
        return (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                {t('Derinlikteki Basınç:', 'Pressure at Depth:')}
              </Text>
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  P = ρ × g × h
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {t(
                  'P: basınç (Pa), ρ: sıvı yoğunluğu (kg/m³), g: yerçekimi ivmesi (9.8 m/s²), h: derinlik (m)',
                  'P: pressure (Pa), ρ: fluid density (kg/m³), g: gravitational acceleration (9.8 m/s²), h: depth (m)'
                )}
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                {t('Kaldırma Kuvveti:', 'Buoyant Force:')}
              </Text>
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  F = ρ × g × V
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {t(
                  'F: kaldırma kuvveti (N), ρ: sıvı yoğunluğu (kg/m³), g: yerçekimi ivmesi (9.8 m/s²), V: batan hacim (m³)',
                  'F: buoyant force (N), ρ: fluid density (kg/m³), g: gravitational acceleration (9.8 m/s²), V: submerged volume (m³)'
                )}
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                {t('Batan Kısım Yüzdesi:', 'Submerged Percentage:')}
              </Text>
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  % batan = (ρ1 / ρ2) × 100%
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {t(
                  'Bu formül cisim yüzdüğünde geçerlidir (ρ1 < ρ2).',
                  'This formula applies when the object floats (ρ1 < ρ2).'
                )}
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <Card style={{ padding: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 16 }}>
        {t('Sıvı Basıncı Fiziği', 'Fluid Pressure Physics')}
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            alignItems: 'center',
            backgroundColor:
              activeTab === 'pressure' ? '#f0f0f0' : 'transparent',
            borderRadius: 8,
          }}
          onPress={() => setActiveTab('pressure')}
        >
          <Text>{t('Basınç', 'Pressure')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            alignItems: 'center',
            backgroundColor:
              activeTab === 'buoyancy' ? '#f0f0f0' : 'transparent',
            borderRadius: 8,
          }}
          onPress={() => setActiveTab('buoyancy')}
        >
          <Text>{t('Kaldırma', 'Buoyancy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            alignItems: 'center',
            backgroundColor:
              activeTab === 'formulas' ? '#f0f0f0' : 'transparent',
            borderRadius: 8,
          }}
          onPress={() => setActiveTab('formulas')}
        >
          <Text>{t('Formüller', 'Formulas')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ maxHeight: 300 }}>{renderContent()}</ScrollView>
    </Card>
  );
};

export default InfoPanel;
