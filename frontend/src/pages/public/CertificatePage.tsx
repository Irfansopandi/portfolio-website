import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Calendar, Building } from 'lucide-react';
import { certificateService } from '../../services';
import type { Certificate } from '../../types';

const CertificatePage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Certificate | null>(null);

  useEffect(() => {
    certificateService.getAll()
      .then(res => setCertificates(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb orb-1" style={{ opacity: 0.08 }} />
      <div className="orb orb-2" style={{ opacity: 0.08 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
            — Achievements —
          </span>
          <h1 className="section-title">
            <span className="text-white">My </span>
            <span className="gradient-text">Certificates</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Professional certifications and achievements that validate my expertise.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="certificate-card cursor-pointer group"
                onClick={() => setSelected(cert)}
              >
                {/* Certificate image */}
                <div className="relative h-44 overflow-hidden">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))' }}
                    >
                      <Award size={48} className="text-indigo-400 opacity-60" />
                      <p className="text-indigo-300 text-xs font-mono">Certificate</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Building size={13} className="text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar size={13} className="text-indigo-400 flex-shrink-0" />
                    <span>{cert.date}</span>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      View Credential
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image && (
                <img src={selected.image} alt={selected.title} className="w-full h-64 object-cover" />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selected.title}</h2>
                <p className="text-indigo-400 mb-1">{selected.issuer}</p>
                <p className="text-gray-500 mb-4">{selected.date}</p>
                {selected.credentialUrl && (
                  <a href={selected.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                    <ExternalLink size={16} />
                    View Credential
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;
