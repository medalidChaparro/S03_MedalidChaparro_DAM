import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

import { AppInput } from '../components/common/app-input';
import { AppButton } from '../components/common/app-button';
import { colors } from '../constants/colors';
import { theme } from '../constants/theme';
import {
  validarNombre,
  validarCorreo,
  validarEdad,
  validarEntrada,
} from '../utils/validators';

// Opciones de entradas para el evento
const TIPOS_ENTRADA = [
  { id: 'General', label: 'General', price: '$20', desc: 'Acceso estándar', icon: '🎟️' },
  { id: 'VIP', label: 'VIP', price: '$50', desc: 'Acceso preferencial', icon: '⭐' },
  { id: 'Estudiante', label: 'Estudiante', price: '$10', desc: 'Descuento acreditado', icon: '🎓' },
];

export default function InscripcionEvento() {
  // 02 ESTADO - Estados de los campos
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [edad, setEdad] = useState('');
  const [entrada, setEntrada] = useState('');

  // 04 MENSAJE - Estados de retroalimentación
  const [error, setError] = useState('');
  const [registrado, setRegistrado] = useState(false);
  const [datosRegistrados, setDatosRegistrados] = useState<{
    nombre: string;
    correo: string;
    edad: string;
    entrada: string;
    ticketId: string;
  } | null>(null);

  // 03 VALIDACIÓN - Validación en tiempo real
  const nombreValido = validarNombre(nombre);
  const correoValido = validarCorreo(correo);
  const edadValida = validarEdad(edad);
  const entradaValida = validarEntrada(entrada);

  const totalValidaciones = 4;
  const validacionesCompletadas = [
    nombreValido,
    correoValido,
    edadValida,
    entradaValida,
  ].filter(Boolean).length;

  // Paso actual para el stepper visual
  const getPasoActual = () => {
    if (registrado) return 5; // 05 RESULTADO
    if (error !== '') return 4; // 04 MENSAJE
    if (validacionesCompletadas > 0) return 3; // 03 VALIDACIÓN
    if (nombre || correo || edad || entrada) return 2; // 02 ESTADO
    return 1; // 01 FORMULARIO
  };

  const pasoActual = getPasoActual();

  const handleValidarYEnviar = () => {
    setError('');

    // Validación secuencial con mensajes claros de feedback
    if (!nombreValido) {
      setError('Por favor ingresa tu nombre completo (mínimo 2 caracteres).');
      return;
    }

    if (!correoValido) {
      setError('Por favor ingresa un correo electrónico válido (ejemplo@correo.com).');
      return;
    }

    if (!edadValida) {
      setError('La edad debe ser un número válido de 18 años o más.');
      return;
    }

    if (!entradaValida) {
      setError('Debes seleccionar un tipo de entrada para el evento.');
      return;
    }

    // 05 RESULTADO - Guardar datos y confirmar registro
    const ticketRandom = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    setDatosRegistrados({
      nombre: nombre.trim(),
      correo: correo.trim(),
      edad: edad.trim(),
      entrada,
      ticketId: ticketRandom,
    });
    setRegistrado(true);
    setError('');
  };

  const handleNuevaInscripcion = () => {
    setNombre('');
    setCorreo('');
    setEdad('');
    setEntrada('');
    setError('');
    setRegistrado(false);
    setDatosRegistrados(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* BANNER SUPERIOR CON STEPPER (01 a 05) */}
        <View style={styles.stepperContainer}>
          <Text style={styles.stepperHeaderTitle}>¿Qué debe tener el proyecto?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepperScroll}
          >
            {[
              { id: 1, label: '01 FORMULARIO' },
              { id: 2, label: '02 ESTADO' },
              { id: 3, label: '03 VALIDACIÓN' },
              { id: 4, label: '04 MENSAJE' },
              { id: 5, label: '05 RESULTADO' },
            ].map((step, idx) => {
              const isActive = pasoActual === step.id;
              const isPast = pasoActual > step.id;
              return (
                <View key={step.id} style={styles.stepItemWrapper}>
                  <View
                    style={[
                      styles.stepPill,
                      isActive && styles.stepPillActive,
                      isPast && styles.stepPillPast,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepPillText,
                        isActive && styles.stepPillTextActive,
                        isPast && styles.stepPillTextPast,
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                  {idx < 4 && <Text style={styles.stepArrow}>›</Text>}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* ENCABEZADO DEL FORMULARIO */}
        <View style={styles.header}>
          <View style={styles.badgeOption}>
            <Text style={styles.badgeOptionText}>🌸 OPCIÓN 4 SELECCIONADA</Text>
          </View>

          <View style={styles.headerTitleRow}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>🎟️</Text>
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={styles.overline}>REGISTRO DE ASISTENTES</Text>
              <Text style={styles.title}>Inscripción a Evento</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Completa tus datos personales y elige tu tipo de entrada para reservar tu lugar.
          </Text>
        </View>

        {/* TARJETA DEL FORMULARIO (01 FORMULARIO + 02 ESTADO) */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Datos del Participante</Text>
              <Text style={styles.sectionDescription}>
                Mínimo 3 campos obligatorios + selector de entrada
              </Text>
            </View>
            <View style={styles.formTag}>
              <Text style={styles.formTagText}>Paso 01 & 02</Text>
            </View>
          </View>

          {/* CAMPO 1: NOMBRE COMPLETO */}
          <AppInput
            label="1. Nombre completo *"
            placeholder="Ej. Sofia Ramos Mendoza"
            value={nombre}
            onChangeText={(value) => {
              setNombre(value);
              setError('');
              if (registrado) setRegistrado(false);
            }}
            icon="👤"
          />
          {nombre.length > 0 && (
            <Text
              style={[
                styles.fieldStatus,
                nombreValido ? styles.validText : styles.invalidText,
              ]}
            >
              {nombreValido ? '✓ Nombre completado correctamente' : '○ Ingresa al menos 2 caracteres'}
            </Text>
          )}

          {/* CAMPO 2: CORREO ELECTRÓNICO */}
          <AppInput
            label="2. Correo electrónico *"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChangeText={(value) => {
              setCorreo(value);
              setError('');
              if (registrado) setRegistrado(false);
            }}
            keyboardType="email-address"
            icon="✉️"
          />
          {correo.length > 0 && (
            <Text
              style={[
                styles.fieldStatus,
                correoValido ? styles.validText : styles.invalidText,
              ]}
            >
              {correoValido ? '✓ Correo con formato válido (@ y dominio)' : '○ Debe contener un @ y dominio válido'}
            </Text>
          )}

          {/* CAMPO 3: EDAD */}
          <AppInput
            label="3. Edad *"
            placeholder="Ej. 22"
            value={edad}
            onChangeText={(value) => {
              setEdad(value);
              setError('');
              if (registrado) setRegistrado(false);
            }}
            keyboardType="numeric"
            icon="🎂"
          />
          {edad.length > 0 && (
            <Text
              style={[
                styles.fieldStatus,
                edadValida ? styles.validText : styles.invalidText,
              ]}
            >
              {edadValida ? '✓ Edad válida (Mayor de 18 años)' : '○ Debes tener 18 años o más'}
            </Text>
          )}

          {/* CAMPO 4: TIPO DE ENTRADA (SELECTOR) */}
          <View style={styles.ticketSection}>
            <Text style={styles.ticketSectionLabel}>4. Tipo de Entrada *</Text>
            <Text style={styles.ticketSectionHelp}>
              Selecciona una modalidad para tu acceso al evento:
            </Text>

            <View style={styles.ticketOptionsGrid}>
              {TIPOS_ENTRADA.map((item) => {
                const isSelected = entrada === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setEntrada(item.id);
                      setError('');
                      if (registrado) setRegistrado(false);
                    }}
                    style={({ pressed }) => [
                      styles.ticketCard,
                      isSelected && styles.ticketCardSelected,
                      pressed && styles.ticketCardPressed,
                    ]}
                  >
                    <View style={styles.ticketCardHeader}>
                      <Text style={styles.ticketIcon}>{item.icon}</Text>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedBadgeText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.ticketTitle,
                        isSelected && styles.ticketTitleSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.ticketPrice,
                        isSelected && styles.ticketPriceSelected,
                      ]}
                    >
                      {item.price}
                    </Text>
                    <Text
                      style={[
                        styles.ticketDesc,
                        isSelected && styles.ticketDescSelected,
                      ]}
                    >
                      {item.desc}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {entrada !== '' ? (
              <Text style={[styles.fieldStatus, styles.validText]}>
                ✓ Entrada {entrada} seleccionada
              </Text>
            ) : (
              <Text style={[styles.fieldStatus, styles.pendingNoticeText]}>
                ○ Por favor selecciona una entrada arriba
              </Text>
            )}
          </View>

          {/* 04 MENSAJE - MENSAJE DE ERROR */}
          {error !== '' && (
            <View style={styles.errorBox}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorIconText}>!</Text>
              </View>
              <View style={styles.messageContainer}>
                <Text style={styles.errorTitle}>Verifica los campos requeridos</Text>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            </View>
          )}

          {/* BOTÓN DE ACCIÓN */}
          <AppButton
            title={registrado ? '✓ Inscripción Guardada' : 'Confirmar Inscripción'}
            onPress={handleValidarYEnviar}
          />
        </View>

        {/* 05 RESULTADO - TARJETA DE CONFIRMACIÓN / TICKET EXITOSO */}
        {registrado && datosRegistrados && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultIconWrap}>
                <Text style={styles.resultIcon}>🎉</Text>
              </View>
              <View style={styles.resultHeaderInfo}>
                <Text style={styles.resultBadge}>05 RESULTADO EXITOSO</Text>
                <Text style={styles.resultTitle}>¡Inscripción Confirmada!</Text>
                <Text style={styles.resultSubtitle}>
                  Los datos se validaron y guardaron en el estado local.
                </Text>
              </View>
            </View>

            {/* PASE DE EVENTO DIGITAL (DISEÑO ROSITA PASTEL) */}
            <View style={styles.passCard}>
              <View style={styles.passTop}>
                <View>
                  <Text style={styles.passEventLabel}>EVENTO ANUAL 2026</Text>
                  <Text style={styles.passEventName}>Pase de Asistente</Text>
                </View>
                <View style={styles.ticketFolioWrap}>
                  <Text style={styles.ticketFolioLabel}>FOLIO</Text>
                  <Text style={styles.ticketFolioText}>
                    {datosRegistrados.ticketId}
                  </Text>
                </View>
              </View>

              <View style={styles.passDashedLine} />

              <View style={styles.passDetails}>
                <View style={styles.passDetailRow}>
                  <Text style={styles.passLabel}>Asistente:</Text>
                  <Text style={styles.passValue}>{datosRegistrados.nombre}</Text>
                </View>

                <View style={styles.passDetailRow}>
                  <Text style={styles.passLabel}>Correo:</Text>
                  <Text style={styles.passValue}>{datosRegistrados.correo}</Text>
                </View>

                <View style={styles.passDetailRow}>
                  <Text style={styles.passLabel}>Edad:</Text>
                  <Text style={styles.passValue}>{datosRegistrados.edad} años</Text>
                </View>

                <View style={styles.passDetailRow}>
                  <Text style={styles.passLabel}>Tipo de Entrada:</Text>
                  <View style={styles.ticketPillBadge}>
                    <Text style={styles.ticketPillBadgeText}>
                      🎟️ {datosRegistrados.entrada}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.passFooter}>
                <Text style={styles.passFooterText}>
                  ✨ Presenta este comprobante el día del evento.
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.newRegistrationBtn}
              onPress={handleNuevaInscripcion}
            >
              <Text style={styles.newRegistrationBtnText}>
                + Inscribir a otra persona
              </Text>
            </Pressable>
          </View>
        )}

        {/* 03 VALIDACIÓN - REGLAS DEL FORMULARIO REQUERIDAS */}
        <View style={styles.validationSection}>
          <View style={styles.validationHeader}>
            <View>
              <Text style={styles.validationTitle}>03 • Validaciones</Text>
              <Text style={styles.validationSubtitle}>
                Reglas aplicadas según la opción 4
              </Text>
            </View>

            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {validacionesCompletadas}/{totalValidaciones}
              </Text>
            </View>
          </View>

          {/* VALIDACIÓN 1 */}
          <ValidationRow
            title="1. Nombre obligatorio"
            description="El campo no puede estar vacío (mínimo 2 letras)."
            valid={nombreValido}
          />

          {/* VALIDACIÓN 2 */}
          <ValidationRow
            title="2. Correo válido"
            description="Debe incluir '@' y estructura de email correcta."
            valid={correoValido}
          />

          {/* VALIDACIÓN 3 */}
          <ValidationRow
            title="3. Edad válida"
            description="Debe ser mayor o igual a 18 años cumplidos."
            valid={edadValida}
          />

          {/* VALIDACIÓN 4 */}
          <ValidationRow
            title="4. Entrada seleccionada"
            description="Debes elegir una opción de boleto (General, VIP o Estudiante)."
            valid={entradaValida}
          />
        </View>

        {/* PIE DE PÁGINA */}
        <View style={styles.footerWrap}>
          <Text style={styles.footerNote}>
            🌸 Diseño Móvil Rosita Pastel • DAM
          </Text>
          <Text style={styles.footerSubNote}>
            Sin bases de datos, APIs ni autenticación externa
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* COMPONENTE PARA CADA FILA DE VALIDACIÓN */
type ValidationRowProps = {
  title: string;
  description: string;
  valid: boolean;
};

function ValidationRow({ title, description, valid }: ValidationRowProps) {
  return (
    <View style={styles.validationRow}>
      <View
        style={[
          styles.validationCircle,
          valid ? styles.validationCircleValid : styles.validationCirclePending,
        ]}
      >
        <Text
          style={[
            styles.validationIcon,
            valid ? styles.validationIconValid : styles.validationIconPending,
          ]}
        >
          {valid ? '✓' : '○'}
        </Text>
      </View>

      <View style={styles.validationInfo}>
        <Text style={styles.validationRowTitle}>{title}</Text>
        <Text style={styles.validationRowDescription}>{description}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          valid ? styles.statusBadgeValid : styles.statusBadgePending,
        ]}
      >
        <Text
          style={[
            styles.statusBadgeText,
            valid ? styles.statusBadgeTextValid : styles.statusBadgeTextPending,
          ]}
        >
          {valid ? 'OK' : 'Pendiente'}
        </Text>
      </View>
    </View>
  );
}

/* ESTILOS EN PALETA ROSITA PASTEL */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Rosita pastel muy suave (#FFF5F8)
  },

  scroll: {
    padding: 18,
    paddingTop: Platform.OS === 'ios' ? 55 : 40,
    paddingBottom: 40,
  },

  /* STEPPER SUPERIOR */
  stepperContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  stepperHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDeep,
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  stepperScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },

  stepPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },

  stepPillPast: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
  },

  stepPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  stepPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  stepPillTextPast: {
    color: colors.primaryDark,
  },

  stepArrow: {
    fontSize: 14,
    color: colors.primaryBorder,
    marginHorizontal: 5,
    fontWeight: '600',
  },

  /* HEADER */
  header: {
    marginBottom: 18,
  },

  badgeOption: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    marginBottom: 10,
  },

  badgeOptionText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDeep,
    letterSpacing: 0.8,
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerIconText: {
    fontSize: 24,
  },

  headerTextGroup: {
    flex: 1,
  },

  overline: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 1.2,
    marginBottom: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 4,
  },

  /* FORMULARIO */
  formCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },

  sectionDescription: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  formTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },

  formTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  /* ESTADO DE LOS CAMPOS */
  fieldStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -10,
    marginBottom: 12,
    paddingLeft: 4,
  },

  validText: {
    color: colors.successText,
  },

  invalidText: {
    color: colors.error,
  },

  pendingNoticeText: {
    color: colors.textMuted,
  },

  /* SELECTOR DE ENTRADA */
  ticketSection: {
    marginTop: 2,
    marginBottom: 14,
  },

  ticketSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },

  ticketSectionHelp: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 10,
  },

  ticketOptionsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },

  ticketCard: {
    flex: 1,
    backgroundColor: '#FFF9FB',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },

  ticketCardSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },

  ticketCardPressed: {
    opacity: 0.8,
  },

  ticketCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    marginBottom: 4,
  },

  ticketIcon: {
    fontSize: 20,
  },

  selectedBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  ticketTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },

  ticketTitleSelected: {
    color: colors.primaryDeep,
    fontWeight: '800',
  },

  ticketPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    marginVertical: 2,
  },

  ticketPriceSelected: {
    color: colors.primaryDeep,
  },

  ticketDesc: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
  },

  ticketDescSelected: {
    color: colors.textSecondary,
    fontWeight: '600',
  },

  /* ERROR BOX */
  errorBox: {
    flexDirection: 'row',
    backgroundColor: colors.errorBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },

  errorIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  errorIconText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '800',
  },

  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  errorTitle: {
    color: colors.errorText,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },

  errorMessage: {
    color: colors.error,
    fontSize: 11,
    lineHeight: 15,
  },

  /* 05 RESULTADO - TARJETA DE CONFIRMACIÓN */
  resultCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  resultIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  resultIcon: {
    fontSize: 22,
  },

  resultHeaderInfo: {
    flex: 1,
  },

  resultBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.8,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  resultSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* TICKET DIGITAL EN ROSITA PASTEL */
  passCard: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    marginBottom: 14,
  },

  passTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  passEventLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 1,
  },

  passEventName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDeep,
  },

  ticketFolioWrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
  },

  ticketFolioLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
  },

  ticketFolioText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  passDashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderStyle: 'dashed',
    marginVertical: 12,
  },

  passDetails: {
    gap: 8,
  },

  passDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  passLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  passValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '700',
  },

  ticketPillBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  ticketPillBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDeep,
  },

  passFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
  },

  passFooterText: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.textSecondary,
    fontWeight: '600',
  },

  newRegistrationBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },

  newRegistrationBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDeep,
  },

  /* 03 VALIDACIÓN */
  validationSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  validationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  validationTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },

  validationSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  counter: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },

  /* FILAS DE VALIDACIÓN */
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  validationCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  validationCircleValid: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },

  validationCirclePending: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },

  validationIcon: {
    fontSize: 15,
    fontWeight: '800',
  },

  validationIconValid: {
    color: colors.successText,
  },

  validationIconPending: {
    color: colors.placeholder,
  },

  validationInfo: {
    flex: 1,
  },

  validationRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },

  validationRowDescription: {
    fontSize: 10.5,
    color: colors.textMuted,
    lineHeight: 14,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },

  statusBadgeValid: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },

  statusBadgePending: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },

  statusBadgeTextValid: {
    color: colors.successText,
  },

  statusBadgeTextPending: {
    color: colors.textMuted,
  },

  /* FOOTER */
  footerWrap: {
    marginTop: 24,
    alignItems: 'center',
  },

  footerNote: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  footerSubNote: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },
});