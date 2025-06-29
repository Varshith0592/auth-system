import {motion} from 'framer-motion'

const FloatingShape = ({color,size,top,left,delay}) => {
  return (
    <motion.div
    className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl ${top} ${left}`}
    animate={{
        x: ["0%","100%","0%"],
        y: ["0%","100%","0%"],
        rotate:[0,360]
    }}
    transition={{
        duration: 20,
        delay: delay,
        ease:"linear",
        repeat:Infinity
    }}
    aria-hidden='true'

    />

   
  )
}

export default FloatingShape